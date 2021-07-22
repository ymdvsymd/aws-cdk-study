import * as cdk from '@aws-cdk/core';
import { CfnInternetGateway, CfnVPCGatewayAttachment, CfnVPC } from '@aws-cdk/aws-ec2';
import { Resource } from './abstracts/resource';

export class InternetGateway extends Resource {
  public readonly igw: CfnInternetGateway;

  constructor(scope: cdk.Construct, vpc: CfnVPC) {
    super(scope);

    this.igw = new CfnInternetGateway(scope, 'InternetGateway', {
      tags: [{ key: 'Name', value: this.getResourceName('igw') }]
    });

    new CfnVPCGatewayAttachment(scope, 'VPCGatewayAttachment', {
      vpcId: vpc.ref,
      internetGatewayId: this.igw.ref
    });
  }
}
