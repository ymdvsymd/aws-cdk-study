import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('RouteTable', () => {
  const stack = testTarget();

  expect(stack).to(countResources('AWS::EC2::RouteTable', 4));
  expect(stack).to(haveResource('AWS::EC2::RouteTable', {
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-rtb-web' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::RouteTable', {
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-rtb-app-1a' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::RouteTable', {
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-rtb-app-1c' }]
  }));
  expect(stack).to(haveResource('AWS::EC2::RouteTable', {
    Tags: [{ 'Key': 'Name', 'Value': 'ymd-test-rtb-db' }]
  }));

  expect(stack).to(countResources('AWS::EC2::Route', 3));
  expect(stack).to(haveResource('AWS::EC2::Route', {
    RouteTableId: { Ref: 'RouteTableWeb' },
    DestinationCidrBlock: '0.0.0.0/0',
    GatewayId: { Ref: 'InternetGateway' }
  }));
  expect(stack).to(haveResource('AWS::EC2::Route', {
    RouteTableId: { Ref: 'RouteTableApp1a' },
    DestinationCidrBlock: '0.0.0.0/0',
    NatGatewayId: { Ref: 'NatGateway1a' }
  }));
  expect(stack).to(haveResource('AWS::EC2::Route', {
    RouteTableId: { Ref: 'RouteTableApp1c' },
    DestinationCidrBlock: '0.0.0.0/0',
    NatGatewayId: { Ref: 'NatGateway1c' }
  }));

  expect(stack).to(countResources('AWS::EC2::SubnetRouteTableAssociation', 6));
  expect(stack).to(haveResource('AWS::EC2::SubnetRouteTableAssociation', {
    RouteTableId: { Ref: 'RouteTableWeb' },
    SubnetId: { Ref: 'SubnetWeb1a' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetRouteTableAssociation', {
    RouteTableId: { Ref: 'RouteTableWeb' },
    SubnetId: { Ref: 'SubnetWeb1c' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetRouteTableAssociation', {
    RouteTableId: { Ref: 'RouteTableApp1a' },
    SubnetId: { Ref: 'SubnetApp1a' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetRouteTableAssociation', {
    RouteTableId: { Ref: 'RouteTableApp1c' },
    SubnetId: { Ref: 'SubnetApp1c' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetRouteTableAssociation', {
    RouteTableId: { Ref: 'RouteTableDb' },
    SubnetId: { Ref: 'SubnetDb1a' }
  }));
  expect(stack).to(haveResource('AWS::EC2::SubnetRouteTableAssociation', {
    RouteTableId: { Ref: 'RouteTableDb' },
    SubnetId: { Ref: 'SubnetDb1c' }
  }));
});
