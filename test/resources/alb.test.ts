import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('Alb', () => {
  const stack = testTarget();

  expect(stack).to(countResources('AWS::ElasticLoadBalancingV2::LoadBalancer', 1));
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
    IpAddressType: 'ipv4',
    Name: 'ymd-test-alb',
    Scheme: 'internet-facing',
    SecurityGroups: [{
      "Fn::GetAtt": [
        "SecurityGroupAlb",
        "GroupId"
      ]
    }],
    Subnets: [{ Ref: 'SubnetWeb1a' }, { Ref: 'SubnetWeb1c' }],
    Type: 'application'
  }));

  expect(stack).to(countResources('AWS::ElasticLoadBalancingV2::TargetGroup', 1));
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
    Name: 'ymd-test-tg',
    Port: 80,
    Protocol: 'HTTP',
    TargetType: 'instance',
    Targets: [{ Id: { Ref: 'Ec2Instance1a' } }, { Id: { Ref: 'Ec2Instance1c' } }],
    VpcId: { Ref: 'Vpc' }
  }));

  expect(stack).to(countResources('AWS::ElasticLoadBalancingV2::Listener', 1));
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
    DefaultActions: [{
      Type: 'forward',
      ForwardConfig: {
        TargetGroups: [{
          TargetGroupArn: { Ref: 'AlbTargetGroup' },
          Weight: 1
        }]
      }
    }],
    LoadBalancerArn: { Ref: 'Alb' },
    Port: 80,
    Protocol: 'HTTP'
  }));
});
