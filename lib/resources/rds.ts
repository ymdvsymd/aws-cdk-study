
import * as cdk from '@aws-cdk/core';
import { CfnDBSubnetGroup, CfnDBClusterParameterGroup, CfnDBParameterGroup, CfnDBCluster } from '@aws-cdk/aws-rds';
import { CfnSecurityGroup, CfnSubnet } from '@aws-cdk/aws-ec2';
import { Resource } from './core/resource';
import { upperCamelCase } from '../string';
import { SecretsManager } from './secretsManager';

export class Rds extends Resource {
  private static readonly dbName = 'devio';

  readonly cluster: CfnDBCluster;

  private readonly subnetGroup: CfnDBSubnetGroup;
  private readonly clusterParameterGroup: CfnDBClusterParameterGroup;
  private readonly parameterGroup: CfnDBParameterGroup;

  constructor(
    scope: cdk.Construct,
    private readonly subnetDb1a: CfnSubnet,
    private readonly subnetDb1c: CfnSubnet,
    private readonly securityGroup: CfnSecurityGroup,
    private readonly secretManager: SecretsManager
  ) {
    super(scope);
    this.subnetGroup = this.createSubnetGroup();
    this.clusterParameterGroup = this.createClusterParameterGroup();
    this.parameterGroup = this.createParameterGroup();
    this.cluster = this.createCluster();
  }

  private createSubnetGroup(): CfnDBSubnetGroup {
    return new CfnDBSubnetGroup(this.scope, 'RdsSubnetGroup', {
      dbSubnetGroupDescription: 'Subnet Group for RDS',
      subnetIds: [this.subnetDb1a.ref, this.subnetDb1c.ref],
      dbSubnetGroupName: this.makeName('rds-sng')
    });
  }

  private createClusterParameterGroup(): CfnDBClusterParameterGroup {
    return new CfnDBClusterParameterGroup(this.scope, 'RdsClusterParameterGroup', {
      description: 'Cluster Parameter Group for RDS',
      family: 'aurora-mysql5.7',
      parameters: { time_zone: 'UTC' }
    });
  }

  private createParameterGroup(): CfnDBParameterGroup {
    return new CfnDBParameterGroup(this.scope, 'RdsParameterGroup', {
      description: 'Parameter Group for RDS',
      family: 'aurora-mysql5.7'
    });
  }

  private createCluster(): CfnDBCluster {
    return new CfnDBCluster(this.scope, 'RdsCluster', {
      engine: 'aurora-mysql',
      backupRetentionPeriod: 7,
      databaseName: Rds.dbName,
      dbClusterIdentifier: this.makeName('rds-cluster'),
      dbClusterParameterGroupName: this.clusterParameterGroup.ref,
      dbSubnetGroupName: this.subnetGroup.ref,
      enableCloudwatchLogsExports: ['error'],
      engineMode: 'provisioned',
      engineVersion: '5.7.mysql_aurora.2.10.0',
      masterUsername: this.secretManager.masterUserName,
      masterUserPassword: this.secretManager.masterUserPassword,
      port: 3306,
      preferredBackupWindow: '19:00-19:30',
      preferredMaintenanceWindow: 'sun:19:30-sun:20:00',
      storageEncrypted: true,
      vpcSecurityGroupIds: [this.securityGroup.attrGroupId]
    });
  }
}
