
import * as cdk from '@aws-cdk/core';
import { CfnDBSubnetGroup, CfnDBClusterParameterGroup, CfnDBParameterGroup, CfnDBCluster, CfnDBInstance } from '@aws-cdk/aws-rds';
import { CfnSecurityGroup, CfnSubnet } from '@aws-cdk/aws-ec2';
import { CfnRole } from '@aws-cdk/aws-iam';
import { Resource } from './core/resource';
import { upperCamelCase } from '../string';
import { SecretsManager } from './secretsManager';

export class Rds extends Resource {
  private static readonly dbName = 'devio';
  private static readonly engine = 'aurora-mysql';
  private static readonly instanceClass = 'db.r5.large';

  private static get family() {
    return this.engine + '5.7';
  }

  readonly cluster: CfnDBCluster;
  readonly instance1a: CfnDBInstance;
  readonly instance1c: CfnDBInstance;

  private readonly subnetGroup: CfnDBSubnetGroup;
  private readonly clusterParameterGroup: CfnDBClusterParameterGroup;
  private readonly parameterGroup: CfnDBParameterGroup;

  constructor(
    scope: cdk.Construct,
    private readonly subnetDb1a: CfnSubnet,
    private readonly subnetDb1c: CfnSubnet,
    private readonly securityGroup: CfnSecurityGroup,
    private readonly secretManager: SecretsManager,
    private readonly monitoringRole: CfnRole
  ) {
    super(scope);
    this.subnetGroup = this.createSubnetGroup();
    this.clusterParameterGroup = this.createClusterParameterGroup();
    this.parameterGroup = this.createParameterGroup();
    this.cluster = this.createCluster();
    this.instance1a = this.createInstance('a', 'sun:20:00-sun:20:30');
    this.instance1a = this.createInstance('c', 'sun:20:30-sun:21:00');
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
      family: Rds.family,
      parameters: { time_zone: 'UTC' }
    });
  }

  private createParameterGroup(): CfnDBParameterGroup {
    return new CfnDBParameterGroup(this.scope, 'RdsParameterGroup', {
      description: 'Parameter Group for RDS',
      family: Rds.family
    });
  }

  private createCluster(): CfnDBCluster {
    return new CfnDBCluster(this.scope, 'RdsCluster', {
      engine: Rds.engine,
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

  private createInstance(azSuffix: string, preferredMaintenanceWindow: string): CfnDBInstance {
    return new CfnDBInstance(this.scope, `RdsInstance1${azSuffix}`, {
      dbInstanceClass: Rds.instanceClass,
      autoMinorVersionUpgrade: false,
      availabilityZone: `ap-northeast-1${azSuffix}`,
      dbClusterIdentifier: this.cluster.ref,
      dbInstanceIdentifier: this.makeName(`rds-instance-1${azSuffix}`),
      dbParameterGroupName: this.parameterGroup.ref,
      dbSubnetGroupName: this.subnetGroup.ref,
      enablePerformanceInsights: true,
      engine: Rds.engine,
      monitoringInterval: 60,
      monitoringRoleArn: this.monitoringRole.attrArn,
      performanceInsightsRetentionPeriod: 7,
      preferredMaintenanceWindow: preferredMaintenanceWindow
    });
  }
}
