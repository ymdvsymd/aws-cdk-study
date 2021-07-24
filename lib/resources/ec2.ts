import * as cdk from '@aws-cdk/core';
import { CfnInstance, CfnSecurityGroup, CfnSubnet } from '@aws-cdk/aws-ec2';
import { CfnInstanceProfile } from '@aws-cdk/aws-iam';
import { Resource, upperCamelCase } from './core/resource';

export class Ec2 extends Resource {
  private static readonly imageId = 'ami-06631ebafb3ae5d34';
  private static readonly instanceType = 't2.micro';

  readonly instance1a: CfnInstance;
  readonly instance1c: CfnInstance;

  constructor(
    scope: cdk.Construct,
    subnetApp1a: CfnSubnet,
    subnetApp1c: CfnSubnet,
    private readonly instanceProfile: CfnInstanceProfile,
    private readonly securityGroup: CfnSecurityGroup
  ) {
    super(scope);
    this.instance1a = this.create('a', subnetApp1a);
    this.instance1c = this.create('c', subnetApp1c);
  }

  private create(azSuffix: string, subnet: CfnSubnet): CfnInstance {
    return new CfnInstance(this.scope, `Ec2Instance1${azSuffix}`, {
      availabilityZone: `ap-northeast-1${azSuffix}`,
      iamInstanceProfile: this.instanceProfile.ref,
      imageId: Ec2.imageId,
      instanceType: Ec2.instanceType,
      securityGroupIds: [this.securityGroup.ref],
      subnetId: subnet.ref,
      tags: [this.makeNameTag(`ec2-1${azSuffix}`)]
    });
  }
}
