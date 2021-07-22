import * as cdk from '@aws-cdk/core';
import { CfnVPC } from '@aws-cdk/aws-ec2';
import { Resource } from './abstracts/resource';

export class Vpc extends Resource {
  readonly self: CfnVPC;

  constructor(scope: cdk.Construct) {
    super(scope);

    this.self = new CfnVPC(scope, 'Vpc', {
      cidrBlock: '10.1.0.0/16',
      tags: [{ key: 'Name', value: this.getResourceName('vpc') }]
    });
  }
}
