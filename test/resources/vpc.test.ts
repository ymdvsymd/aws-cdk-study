import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { createTestTarget } from '../context'

test('Vpc', () => {
  const stack = createTestTarget();
  expect(stack).to(countResources('AWS::EC2::VPC', 1));
  expect(stack).to(haveResource('AWS::EC2::VPC', {
    CidrBlock: '10.1.0.0/16',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-vpc' }]
  }));
});
