import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('ElasticIp', () => {
  const stack = testTarget();
  expect(stack).to(countResources('AWS::EC2::EIP', 2));
  expect(stack).to(haveResource('AWS::EC2::EIP', {
    Domain: 'vpc',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-eip-ngw-1a' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::EIP', {
    Domain: 'vpc',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-eip-ngw-1c' }]
  }));
});
