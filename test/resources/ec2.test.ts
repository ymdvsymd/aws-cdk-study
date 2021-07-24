import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('Ec2', () => {
  const stack = testTarget(); expect(stack).to(countResources('AWS::EC2::Instance', 2));
  expect(stack).to(haveResource('AWS::EC2::Instance', {
    AvailabilityZone: 'ap-northeast-1a',
    IamInstanceProfile: { Ref: 'InstanceProfileEc2' },
    ImageId: 'ami-06631ebafb3ae5d34',
    InstanceType: 't2.micro',
    SecurityGroupIds: [{ Ref: 'SecurityGroupEc2' }],
    SubnetId: { Ref: 'SubnetApp1a' },
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-ec2-1a' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::Instance', {
    AvailabilityZone: 'ap-northeast-1c',
    IamInstanceProfile: { Ref: 'InstanceProfileEc2' },
    ImageId: 'ami-06631ebafb3ae5d34',
    InstanceType: 't2.micro',
    SecurityGroupIds: [{ Ref: 'SecurityGroupEc2' }],
    SubnetId: { Ref: 'SubnetApp1c' },
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-ec2-1c' }]
  }));
});
