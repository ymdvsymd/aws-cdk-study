import { expect, countResources, haveResource, anything } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('Rds', () => {
  const stack = testTarget();

  expect(stack).to(countResources('AWS::RDS::DBSubnetGroup', 1));
  expect(stack).to(haveResource('AWS::RDS::DBSubnetGroup', {
    DBSubnetGroupDescription: 'Subnet Group for RDS',
    SubnetIds: [{ Ref: 'SubnetDb1a' }, { Ref: 'SubnetDb1c' }],
    DBSubnetGroupName: 'ymd-test-rds-sng'
  }));

  expect(stack).to(countResources('AWS::RDS::DBClusterParameterGroup', 1));
  expect(stack).to(haveResource('AWS::RDS::DBClusterParameterGroup', {
    Description: 'Cluster Parameter Group for RDS',
    Family: 'aurora-mysql5.7',
    Parameters: { time_zone: 'UTC' }
  }));

  expect(stack).to(countResources('AWS::RDS::DBParameterGroup', 1));
  expect(stack).to(haveResource('AWS::RDS::DBParameterGroup', {
    Description: 'Parameter Group for RDS',
    Family: 'aurora-mysql5.7'
  }));

  expect(stack).to(countResources('AWS::RDS::DBCluster', 1));
  expect(stack).to(haveResource('AWS::RDS::DBCluster', {
    Engine: 'aurora-mysql',
    BackupRetentionPeriod: 7,
    DatabaseName: 'devio',
    DBClusterIdentifier: 'ymd-test-rds-cluster',
    DBClusterParameterGroupName: { Ref: 'RdsClusterParameterGroup' },
    DBSubnetGroupName: { Ref: 'RdsSubnetGroup' },
    EnableCloudwatchLogsExports: ['error'],
    EngineMode: 'provisioned',
    EngineVersion: '5.7.mysql_aurora.2.10.0',
    MasterUsername: { 'Fn::Join': ['', ['{{resolve:secretsmanager:', { Ref: 'SecretsRdsCluster' }, ':SecretString:MasterUserName}}']] },
    MasterUserPassword: { 'Fn::Join': ['', ['{{resolve:secretsmanager:', { Ref: 'SecretsRdsCluster' }, ':SecretString:MasterUserPassword}}']] },
    Port: 3306,
    PreferredBackupWindow: '19:00-19:30',
    PreferredMaintenanceWindow: 'sun:19:30-sun:20:00',
    StorageEncrypted: true,
    VpcSecurityGroupIds: [{ "Fn::GetAtt": ['SecurityGroupRds', 'GroupId'] }]
  }));
});
