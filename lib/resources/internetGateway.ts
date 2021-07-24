import * as cdk from '@aws-cdk/core';
import { CfnInternetGateway, CfnVPCGatewayAttachment } from '@aws-cdk/aws-ec2';
import { Resource } from './core/resource';
import { Vpc } from './vpc';

export class InternetGateway extends Resource {
  public readonly self: CfnInternetGateway;

  constructor(scope: cdk.Construct, vpc: Vpc) {
    super(scope);

    this.self = new CfnInternetGateway(scope, 'InternetGateway', {
      tags: [{ key: 'Name', value: this.makeName('igw') }]
    });

    new CfnVPCGatewayAttachment(scope, 'VPCGatewayAttachment', {
      vpcId: vpc.self.ref,
      internetGatewayId: this.self.ref
    });
  }
}
