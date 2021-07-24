import * as cdk from '@aws-cdk/core';
import { CfnSecurityGroup, CfnVPC, CfnSecurityGroupIngressProps, CfnSecurityGroupIngress } from '@aws-cdk/aws-ec2';
import { Resource } from './core/resource';
import { upperCamelCase } from './core/string';
import { Vpc } from './vpc';

export class SecurityGroup extends Resource {
  readonly alb: CfnSecurityGroup;
  readonly ec2: CfnSecurityGroup;
  readonly rds: CfnSecurityGroup;

  private readonly vpc: CfnVPC;

  constructor(scope: cdk.Construct, vpc: Vpc) {
    super(scope);
    this.vpc = vpc.self;
    this.alb = this.create('alb', [{
      ipProtocol: 'tcp',
      cidrIp: '0.0.0.0/0',
      fromPort: 80,
      toPort: 80
    }, {
      ipProtocol: 'tcp',
      cidrIp: '0.0.0.0/0',
      fromPort: 443,
      toPort: 443
    }]);
    this.ec2 = this.create('ec2', [{
      ipProtocol: 'tcp',
      sourceSecurityGroupId: this.alb.attrGroupId,
      fromPort: 80,
      toPort: 80
    }]);
    this.rds = this.create('rds', [{
      ipProtocol: 'tcp',
      sourceSecurityGroupId: this.ec2.attrGroupId,
      fromPort: 3306,
      toPort: 3306
    }]);
  }

  private create(nameSuffix: string, ingresses: CfnSecurityGroupIngressProps[]): CfnSecurityGroup {
    const securityGroup = new CfnSecurityGroup(this.scope, `SecurityGroup${upperCamelCase(nameSuffix)}`, {
      groupDescription: `for ${nameSuffix.toUpperCase()}`,
      groupName: this.makeName(`sg-${nameSuffix}`),
      vpcId: this.vpc.ref,
      tags: [this.makeNameTag(`sg-${nameSuffix}`)]
    });

    let no = 0;
    for (const ingressProps of ingresses) {
      const ingress = new CfnSecurityGroupIngress(this.scope, `SecurityGroupIngress${upperCamelCase(nameSuffix) + no}`, ingressProps);
      ingress.groupId = securityGroup.attrGroupId;
      no++;
    }

    return securityGroup;
  }
}
