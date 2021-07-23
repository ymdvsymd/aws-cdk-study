import * as cdk from '@aws-cdk/core';
import { Vpc } from './resources/vpc';
import { Subnet } from './resources/subnet';
import { InternetGateway } from './resources/internetGateway';
import { ElasticIp } from './resources/elasticIp';
import { NatGateway } from './resources/natGateway';
import { RouteTable } from './resources/routeTable';
import { NetworkAcl } from './resources/networkAcl';
import { IamRole } from './resources/iamRole';

export class DevioStack extends cdk.Stack {
  readonly vpc: Vpc;
  readonly subnet: Subnet;
  readonly igw: InternetGateway;
  readonly eip: ElasticIp;
  readonly ngw: NatGateway;
  readonly rtb: RouteTable;
  readonly nacl: NetworkAcl;
  readonly role: IamRole;
    
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.vpc = new Vpc(this);
    this.subnet = new Subnet(this, this.vpc);
    this.igw = new InternetGateway(this, this.vpc);
    this.eip = new ElasticIp(this);
    this.ngw = new NatGateway(this, this.eip, this.subnet.web1a, this.subnet.web1c);
    this.rtb = new RouteTable(this, this.vpc, this.subnet, this.igw, this.ngw);
    this.nacl = new NetworkAcl(this, this.vpc, this.subnet);
    this.role = new IamRole(this);
  }
}
