import * as cdk from '@aws-cdk/core';
import { CfnInstance, CfnSecurityGroup, CfnSubnet } from '@aws-cdk/aws-ec2';
import { CfnRole, CfnInstanceProfile } from '@aws-cdk/aws-iam';
import { Resource } from './core/resource';

export class Ec2 extends Resource {
  private static readonly imageId = 'ami-06631ebafb3ae5d34';
  private static readonly instanceType = 't2.micro';

  readonly instance1a: CfnInstance;
  readonly instance1c: CfnInstance;

  private readonly instanceProfile: CfnInstanceProfile;

  constructor(
    scope: cdk.Construct,
    role: CfnRole,
    private readonly securityGroup: CfnSecurityGroup,
    subnetApp1a: CfnSubnet,
    subnetApp1c: CfnSubnet
  ) {
    super(scope);

    this.instanceProfile = new CfnInstanceProfile(this.scope, 'InstanceProfileEc2', {
      roles: [role.ref],
      instanceProfileName: role.roleName
    });

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
