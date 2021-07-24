import * as cdk from '@aws-cdk/core';
import { Vpc } from './resources/vpc';
import { Subnet } from './resources/subnet';
import { InternetGateway } from './resources/internetGateway';
import { ElasticIp } from './resources/elasticIp';
import { NatGateway } from './resources/natGateway';
import { RouteTable } from './resources/routeTable';
import { NetworkAcl } from './resources/networkAcl';
import { IamRole } from './resources/iamRole';
import { SecurityGroup } from './resources/securityGroup';
import { Ec2 } from './resources/ec2';

export class DevioStack extends cdk.Stack {
  readonly vpc: Vpc;
  readonly subnet: Subnet;
  readonly igw: InternetGateway;
  readonly eip: ElasticIp;
  readonly ngw: NatGateway;
  readonly rtb: RouteTable;
  readonly nacl: NetworkAcl;
  readonly role: IamRole;
  readonly sg: SecurityGroup;
  readonly ec2: Ec2;
    
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
    this.sg = new SecurityGroup(this, this.vpc);
    this.ec2 = new Ec2(this, this.role.ec2, this.sg.ec2, this.subnet.app1a, this.subnet.app1c);
  }
}
