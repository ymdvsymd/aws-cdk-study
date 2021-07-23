import { expect, countResources, countResourcesLike, haveResource, anything } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('NetworkAcl', () => {
  const stack = testTarget();

  expect(stack).to(countResources('AWS::EC2::NetworkAcl', 3));
  expect(stack).to(haveResource('AWS::EC2::NetworkAcl', {
    VpcId: { Ref: 'Vpc' },
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-nacl-web' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::NetworkAcl', {
    VpcId: { Ref: 'Vpc' },
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-nacl-app' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::NetworkAcl', {
    VpcId: { Ref: 'Vpc' },
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-nacl-db' }]
  }));

  expect(stack).to(countResourcesLike('AWS::EC2::NetworkAclEntry', 3, {
    NetworkAclId: anything(),
    Protocol: -1,
    RuleAction: 'allow',
    RuleNumber: 100,
    CidrBlock: '0.0.0.0/0',
    Egress: false
  }));
  expect(stack).to(countResourcesLike('AWS::EC2::NetworkAclEntry', 3, {
    NetworkAclId: anything(),
    Protocol: -1,
    RuleAction: 'allow',
    RuleNumber: 100,
    CidrBlock: '0.0.0.0/0',
    Egress: true
  }));

  expect(stack).to(countResources('AWS::EC2::SubnetNetworkAclAssociation', 6));
  expect(stack).to(haveResource('AWS::EC2::SubnetNetworkAclAssociation', {
    NetworkAclId: { Ref: 'NetworkAclWeb' },
    SubnetId: { Ref: 'SubnetWeb1a' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetNetworkAclAssociation', {
    NetworkAclId: { Ref: 'NetworkAclWeb' },
    SubnetId: { Ref: 'SubnetWeb1c' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetNetworkAclAssociation', {
    NetworkAclId: { Ref: 'NetworkAclApp' },
    SubnetId: { Ref: 'SubnetApp1a' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetNetworkAclAssociation', {
    NetworkAclId: { Ref: 'NetworkAclApp' },
    SubnetId: { Ref: 'SubnetApp1c' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetNetworkAclAssociation', {
    NetworkAclId: { Ref: 'NetworkAclDb' },
    SubnetId: { Ref: 'SubnetDb1a' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetNetworkAclAssociation', {
    NetworkAclId: { Ref: 'NetworkAclDb' },
    SubnetId: { Ref: 'SubnetDb1c' }
  }));
});
