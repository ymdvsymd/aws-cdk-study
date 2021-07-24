import * as cdk from '@aws-cdk/core';
import { CfnNetworkAcl, CfnSubnet, CfnVPC, CfnNetworkAclEntry, CfnSubnetNetworkAclAssociation } from '@aws-cdk/aws-ec2';
import { capitalize, upperCamelCase, Resource } from './core/resource';
import { Subnet } from './subnet';
import { Vpc } from './vpc';

export class NetworkAcl extends Resource {
  readonly web: CfnNetworkAcl;
  readonly app: CfnNetworkAcl;
  readonly db: CfnNetworkAcl;

  private readonly vpc: CfnVPC;

  constructor(scope: cdk.Construct, vpc: Vpc, subnet: Subnet) {
    super(scope);
    this.vpc = vpc.self;
    this.web = this.create('web', [subnet.web1a, subnet.web1c]);
    this.app = this.create('app', [subnet.app1a, subnet.app1c]);
    this.db = this.create('db', [subnet.db1a, subnet.db1c]);
  }

  private create(nameSuffix: string, subnets: CfnSubnet[]): CfnNetworkAcl {
    const networkAcl = new CfnNetworkAcl(this.scope, `NetworkAcl${upperCamelCase(nameSuffix)}`, {
      vpcId: this.vpc.ref,
      tags: [{ key: 'Name', value: this.makeName(`nacl-${nameSuffix}`) }]
    });

    this.addEntryTo(networkAcl, nameSuffix, 'ingress');
    this.addEntryTo(networkAcl, nameSuffix, 'egress');

    this.associateWith(networkAcl, nameSuffix, subnets);

    return networkAcl;
  }

  private addEntryTo(networkAcl: CfnNetworkAcl, nameSuffix: string, direction: 'ingress' | 'egress') {
    new CfnNetworkAclEntry(this.scope, `NetworkAclEntry${upperCamelCase(direction) + capitalize(nameSuffix)}`, {
      networkAclId: networkAcl.ref,
      protocol: -1,
      ruleAction: 'allow',
      ruleNumber: 100,
      cidrBlock: '0.0.0.0/0',
      egress: direction === 'egress'
    });
  }

  private associateWith(networkAcl: CfnNetworkAcl, nameSuffix: string, subnets: CfnSubnet[]) {
    let no = 0;
    for (const subnet of subnets) {
      new CfnSubnetNetworkAclAssociation(this.scope, `NetworkAclAssociation${upperCamelCase(nameSuffix) + no}`, {
        networkAclId: networkAcl.ref,
        subnetId: subnet.ref
      });
      no++;
    }
  }
}
