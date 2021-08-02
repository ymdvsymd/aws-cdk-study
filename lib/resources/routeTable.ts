import * as cdk from '@aws-cdk/core';
import { CfnInternetGateway, CfnNatGateway, CfnRoute, CfnRouteTable, CfnSubnet, CfnSubnetRouteTableAssociation, CfnVPC } from '@aws-cdk/aws-ec2';
import { Resource } from './core/resource';
import { upperCamelCase } from '../string';
import { Subnet } from './subnet';
import { NatGateway } from './natGateway';
import { Vpc } from './vpc';
import { InternetGateway } from './internetGateway';

export class RouteTable extends Resource {
  readonly web: CfnRouteTable;
  readonly app1a: CfnRouteTable;
  readonly app1c: CfnRouteTable;
  readonly db: CfnRouteTable;

  private readonly vpc: CfnVPC;

  constructor(
    scope: cdk.Construct,
    vpc: Vpc,
    subnet: Subnet,
    internetGateway: InternetGateway,
    natGateway: NatGateway
  ) {
    super(scope);
    this.vpc = vpc.self;
    this.web = this.create('web',
      [{ destination: '0.0.0.0/0', target: internetGateway.self }],
      [subnet.web1a, subnet.web1c]
    );
    this.app1a = this.create('app-1a',
      [{ destination: '0.0.0.0/0', target: natGateway.ngw1a }],
      [subnet.app1a]
      );
    this.app1c = this.create('app-1c',
      [{ destination: '0.0.0.0/0', target: natGateway.ngw1c }],
      [subnet.app1c]
    );
    this.db = this.create('db',
      [],
      [subnet.db1a, subnet.db1c]
    );
  }

  private create(
    nameSuffix: string,
    routes: { destination: string, target?: CfnInternetGateway | CfnNatGateway }[],
    subnets: CfnSubnet[]
  ): CfnRouteTable {
    const routeTable = new CfnRouteTable(this.scope, `RouteTable${upperCamelCase(nameSuffix)}`, {
      vpcId: this.vpc.ref,
      tags: [{ key: 'Name', value: this.makeName(`rtb-${nameSuffix}`) }]
    });

    this.addRouteTo(routeTable, nameSuffix, routes);

    this.associateWith(routeTable, nameSuffix, subnets);

    return routeTable;
  }
  
  private addRouteTo(
    routeTable: CfnRouteTable,
    nameSuffix: string,
    routes: { destination: string; target?: CfnInternetGateway | CfnNatGateway | undefined; }[]
  ) {
    let no = 0;
    for (const routeInfo of routes) {
      const route = new CfnRoute(this.scope, `Route${upperCamelCase(nameSuffix) + no}`, {
        routeTableId: routeTable.ref,
        destinationCidrBlock: routeInfo.destination
      });

      if (routeInfo.target instanceof CfnInternetGateway) {
        route.gatewayId = routeInfo.target.ref;
      } else if (routeInfo.target instanceof CfnNatGateway) {
        route.natGatewayId = routeInfo.target.ref;
      }

      no++;
    }
  }

  private associateWith(
    routeTable: CfnRouteTable,
    nameSuffix: string,
    subnets: CfnSubnet[]
  ) {
    let no = 0;
    for (const subnet of subnets) {
      new CfnSubnetRouteTableAssociation(this.scope, `Association${upperCamelCase(nameSuffix) + no}`, {
        routeTableId: routeTable.ref,
        subnetId: subnet.ref
      });
      no++;
    }
  }
}
