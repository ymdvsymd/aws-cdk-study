import * as cdk from '@aws-cdk/core';
import { CfnSubnet, CfnVPC } from '@aws-cdk/aws-ec2';
import { Resource } from './core/resource';

export class Subnet extends Resource {
  readonly web1a: CfnSubnet;
  readonly web1c: CfnSubnet;
  readonly app1a: CfnSubnet;
  readonly app1c: CfnSubnet;
  readonly db1a: CfnSubnet;
  readonly db1c: CfnSubnet;

  private readonly vpc: CfnVPC;

  constructor(scope: cdk.Construct, vpc: CfnVPC) {
    super(scope);
    this.vpc = vpc;
    this.web1a = this.create('web', 'a', '10.1.11.0/24');
    this.web1c = this.create('web', 'c', '10.1.12.0/24');
    this.app1a = this.create('app', 'a', '10.1.21.0/24');
    this.app1c = this.create('app', 'c', '10.1.22.0/24');
    this.db1a = this.create('db', 'a', '10.1.31.0/24');
    this.db1c = this.create('db', 'c', '10.1.32.0/24');
  }

  private create(purpose: string, azSuffix: string, cidr: string): CfnSubnet {
    return new CfnSubnet(this.scope, `Subnet${purpose.charAt(0).toUpperCase() + purpose.slice(1)}1${azSuffix}`, {
      cidrBlock: cidr,
      vpcId: this.vpc.ref,
      availabilityZone: `ap-northeast-1${azSuffix}`,
      tags: [{ key: 'Name', value: this.makeName(`subnet-${purpose}-1${azSuffix}`) }]
    });
  }
}
