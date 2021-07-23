import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('Vpc', () => {
  const stack = testTarget();
  expect(stack).to(countResources('AWS::EC2::VPC', 1));
  expect(stack).to(haveResource('AWS::EC2::VPC', {
    CidrBlock: '10.1.0.0/16',
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-vpc' }]
  }));
});
