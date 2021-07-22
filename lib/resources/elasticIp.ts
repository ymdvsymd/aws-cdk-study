import * as cdk from '@aws-cdk/core';
import { CfnEIP } from '@aws-cdk/aws-ec2';
import { Resource } from './core/resource';

export class ElasticIp extends Resource {
  readonly ngw1a: CfnEIP;
  readonly ngw1c: CfnEIP;

  constructor(scope: cdk.Construct) {
    super(scope);
    this.ngw1a = this.create('a');
    this.ngw1c = this.create('c');
  }

  private create(azSuffix: string): CfnEIP {
    return new CfnEIP(this.scope, `ElasticIpNgw1${azSuffix}`, {
      domain: 'vpc',
      tags: [{ key: 'Name', value: this.getFullName(`eip-ngw-1${azSuffix}`) }]
    });
  }
}
