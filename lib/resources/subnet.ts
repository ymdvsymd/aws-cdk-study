import * as cdk from '@aws-cdk/core';
import { CfnSubnet, CfnVPC } from '@aws-cdk/aws-ec2';
import { Resource } from './abstracts/resource';

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
    this.web1a = this.create('web', '10.1.11.0/24', 'ap-northeast-1a');
    this.web1c = this.create('web', '10.1.12.0/24', 'ap-northeast-1c');
    this.app1a = this.create('app', '10.1.21.0/24', 'ap-northeast-1a');
    this.app1c = this.create('app', '10.1.22.0/24', 'ap-northeast-1c');
    this.db1a = this.create('db', '10.1.31.0/24', 'ap-northeast-1a');
    this.db1c = this.create('db', '10.1.32.0/24', 'ap-northeast-1c');
  }

  private create(type: string, cidr: string, az: string): CfnSubnet {
    const azId = az.slice(-1);
    return new CfnSubnet(this.scope, `Subnet${type.charAt(0).toUpperCase() + type.slice(1)}1${azId}`, {
      cidrBlock: cidr,
      vpcId: this.vpc.ref,
      availabilityZone: az,
      tags: [{ key: 'Name', value: this.getResourceName(`subnet-${type}-1${azId}`) }]
    });
  }
}
