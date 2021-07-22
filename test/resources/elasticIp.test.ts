import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { createTestTarget } from '../context'

test('ElasticIp', () => {
  const stack = createTestTarget();
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
