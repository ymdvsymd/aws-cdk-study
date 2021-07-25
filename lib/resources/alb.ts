import * as cdk from '@aws-cdk/core';
import { CfnListener, CfnLoadBalancer, CfnTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2'
import { CfnSecurityGroup, CfnSubnet } from '@aws-cdk/aws-ec2';
import { Resource } from './core/resource';
import { Vpc } from './vpc';
import { Ec2 } from './ec2';

export class Alb extends Resource {
  readonly self: CfnLoadBalancer;

  constructor(
    scope: cdk.Construct,
    vpc: Vpc,
    subnetWeb1a: CfnSubnet,
    subnetWeb1c: CfnSubnet,
    securityGroup: CfnSecurityGroup,
    ec2: Ec2
  ) {
    super(scope);

    this.self = new CfnLoadBalancer(this.scope, 'Alb', {
      ipAddressType: 'ipv4',
      name: this.makeName('alb'),
      scheme: 'internet-facing',
      securityGroups: [securityGroup.attrGroupId],
      subnets: [subnetWeb1a.ref, subnetWeb1c.ref],
      type: 'application'
    });

    const targetGroup = new CfnTargetGroup(this.scope, 'AlbTargetGroup', {
      name: this.makeName('tg'),
      port: 80,
      protocol: 'HTTP',
      targetType: 'instance',
      targets: [{ id: ec2.instance1a.ref }, { id: ec2.instance1c.ref }],
      vpcId: vpc.self.ref
    });

    new CfnListener(this.scope, 'AlbListener', {
      defaultActions: [{
        type: 'forward',
        forwardConfig: {
          targetGroups: [{
            targetGroupArn: targetGroup.ref,
            weight: 1
          }]
        }
      }],
      loadBalancerArn: this.self.ref,
      port: 80,
      protocol: 'HTTP'
    });
  }
}
