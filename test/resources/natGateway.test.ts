import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('NatGateway', () => {
  const stack = testTarget();
  expect(stack).to(countResources('AWS::EC2::NatGateway', 2));
  expect(stack).to(haveResource('AWS::EC2::NatGateway', {
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-ngw-1a' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::NatGateway', {
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-ngw-1c' }]
  }));
});
