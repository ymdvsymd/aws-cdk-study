import * as cdk from '@aws-cdk/core';
import { CfnSubnet, CfnVPC } from '@aws-cdk/aws-ec2';
import { upperCamelCase, Resource } from './core/resource';
import { Vpc } from './vpc';

export class Subnet extends Resource {
  readonly web1a: CfnSubnet;
  readonly web1c: CfnSubnet;
  readonly app1a: CfnSubnet;
  readonly app1c: CfnSubnet;
  readonly db1a: CfnSubnet;
  readonly db1c: CfnSubnet;

  private readonly vpc: CfnVPC;

  constructor(scope: cdk.Construct, vpc: Vpc) {
    super(scope);
    this.vpc = vpc.self;
    this.web1a = this.create('web-1a', '10.1.11.0/24');
    this.web1c = this.create('web-1c', '10.1.12.0/24');
    this.app1a = this.create('app-1a', '10.1.21.0/24');
    this.app1c = this.create('app-1c', '10.1.22.0/24');
    this.db1a = this.create('db-1a', '10.1.31.0/24');
    this.db1c = this.create('db-1c', '10.1.32.0/24');
  }

  private create(nameSuffix: string, cidr: string): CfnSubnet {
    const azSuffix = nameSuffix.slice(-1);
    return new CfnSubnet(this.scope, `Subnet${upperCamelCase(nameSuffix)}`, {
      cidrBlock: cidr,
      vpcId: this.vpc.ref,
      availabilityZone: `ap-northeast-1${azSuffix}`,
      tags: [{ key: 'Name', value: this.makeName(`subnet-${nameSuffix}`) }]
    });
  }
}
