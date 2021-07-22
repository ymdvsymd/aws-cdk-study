import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { createTestTarget } from '../context'

test('InternetGateway', () => {
  const stack = createTestTarget();
  expect(stack).to(countResources('AWS::EC2::InternetGateway', 1));
  expect(stack).to(haveResource('AWS::EC2::InternetGateway', {
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-igw' }]
  }));
  expect(stack).to(countResources('AWS::EC2::VPCGatewayAttachment', 1));
});
