import * as cdk from '@aws-cdk/core';
import { Vpc } from './resources/vpc';
import { Subnet } from './resources/subnet';
import { InternetGateway } from './resources/internetGateway';

export class DevioStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this);
    const subnet = new Subnet(this, vpc.self);
    const igw = new InternetGateway(this, vpc.self);
  }
}
