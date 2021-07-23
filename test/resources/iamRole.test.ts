import { expect, countResources, haveResource, haveResourceLike, anything } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('IamRole', () => {
  const stack = testTarget();

  expect(stack).to(countResources('AWS::IAM::Role', 2));
  expect(stack).to(haveResourceLike('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Effect: 'Allow',
        Principal: {
          Service: anything()
        },
        Action: 'sts:AssumeRole'
      }]
    },
    ManagedPolicyArns: [
      'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'
    ],
    RoleName: 'ymd-test-role-ec2'
  }));
  expect(stack).to(haveResourceLike('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Effect: 'Allow',
        Principal: {
          Service: 'monitoring.rds.amazonaws.com'
        },
        Action: 'sts:AssumeRole'
      }]
    },
    ManagedPolicyArns: [
      'arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole'
    ],
    RoleName: 'ymd-test-role-rds'
  }));

  expect(stack).to(countResources('AWS::IAM::InstanceProfile', 1));
  expect(stack).to(haveResource('AWS::IAM::InstanceProfile', {
    Roles: [{ Ref: 'RoleEc2' }],
    InstanceProfileName: 'ymd-test-role-ec2'
  }));
});
