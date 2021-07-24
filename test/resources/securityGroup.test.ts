import { expect, countResources, countResourcesLike, haveResource, anything } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('SecurityGroup', () => {
  const stack = testTarget();

  expect(stack).to(countResources('AWS::EC2::SecurityGroup', 3));
  expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
    GroupDescription: 'for ALB',
    GroupName: 'ymd-test-sg-alb',
    VpcId: { Ref: 'Vpc' },
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-sg-alb' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
    GroupDescription: 'for EC2',
    GroupName: 'ymd-test-sg-ec2',
    VpcId: { Ref: 'Vpc' },
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-sg-ec2' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
    GroupDescription: 'for RDS',
    GroupName: 'ymd-test-sg-rds',
    VpcId: { Ref: 'Vpc' },
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-sg-rds' }]
  }));

  expect(stack).to(countResources('AWS::EC2::SecurityGroupIngress', 4));
  expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
    IpProtocol: 'tcp',
    CidrIp: '0.0.0.0/0',
    FromPort: 80,
    ToPort: 80,
    GroupId: {
      "Fn::GetAtt": [
        "SecurityGroupAlb",
        "GroupId"
      ]
    }
  }));
  expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
    GroupId: {
      "Fn::GetAtt": [
        "SecurityGroupAlb",
        "GroupId"
      ]
    },
    CidrIp: '0.0.0.0/0',
    IpProtocol: 'tcp',
    FromPort: 443,
    ToPort: 443
  }));
  expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
    GroupId: {
      "Fn::GetAtt": [
        "SecurityGroupEc2",
        "GroupId"
      ]
    },
    SourceSecurityGroupId: {
      "Fn::GetAtt": [
        "SecurityGroupAlb",
        "GroupId"
      ]
    },
    IpProtocol: 'tcp',
    FromPort: 80,
    ToPort: 80
  }));
  expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
    GroupId: {
      "Fn::GetAtt": [
        "SecurityGroupRds",
        "GroupId"
      ]
    },
    SourceSecurityGroupId: {
      "Fn::GetAtt": [
        "SecurityGroupEc2",
        "GroupId"
      ]
    },
    IpProtocol: 'tcp',
    FromPort: 3306,
    ToPort: 3306
  }));
});
