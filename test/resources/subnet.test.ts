import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('Subnet', () => {
  const stack = testTarget();
  expect(stack).to(countResources('AWS::EC2::Subnet', 6))
  expect(stack).to(haveResource('AWS::EC2::Subnet', {
    CidrBlock: '10.1.11.0/24',
    AvailabilityZone: 'ap-northeast-1a',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-subnet-web-1a' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::Subnet', {
    CidrBlock: '10.1.12.0/24',
    AvailabilityZone: 'ap-northeast-1c',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-subnet-web-1c' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::Subnet', {
    CidrBlock: '10.1.21.0/24',
    AvailabilityZone: 'ap-northeast-1a',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-subnet-app-1a' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::Subnet', {
    CidrBlock: '10.1.22.0/24',
    AvailabilityZone: 'ap-northeast-1c',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-subnet-app-1c' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::Subnet', {
    CidrBlock: '10.1.31.0/24',
    AvailabilityZone: 'ap-northeast-1a',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-subnet-db-1a' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::Subnet', {
    CidrBlock: '10.1.32.0/24',
    AvailabilityZone: 'ap-northeast-1c',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-subnet-db-1c' }]
  }));
});
