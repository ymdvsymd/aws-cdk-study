import * as cdk from '@aws-cdk/core';
import { CfnEIP, CfnNatGateway, CfnSubnet } from '@aws-cdk/aws-ec2';
import { Resource } from './core/resource';
import { ElasticIp } from './elasticIp';

export class NatGateway extends Resource {
  readonly ngw1a: CfnNatGateway;
  readonly ngw1c: CfnNatGateway;

  constructor(
    scope: cdk.Construct,
    elasticIp: ElasticIp,
    publicSubnet1a: CfnSubnet,
    publicSubnet1c: CfnSubnet
  ) {
    super(scope);
    this.ngw1a = this.create('a', elasticIp.ngw1a, publicSubnet1a);
    this.ngw1a = this.create('c', elasticIp.ngw1c, publicSubnet1c);
  }

  private create(azSuffix: string, eip: CfnEIP, subnet: CfnSubnet): CfnNatGateway {
    return new CfnNatGateway(this.scope, `NatGateway1${azSuffix}`, {
      allocationId: eip.attrAllocationId,
      subnetId: subnet.ref,
      tags: [{ key: 'Name', value: this.getFullName(`ngw-1${azSuffix}`) }]
    })
  }
}
