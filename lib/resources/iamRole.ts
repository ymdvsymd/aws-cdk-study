import * as cdk from '@aws-cdk/core';
import { CfnRole, PolicyDocument, PolicyStatement, PolicyStatementProps, Effect, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Resource } from './core/resource';
import { upperCamelCase } from './core/string';

export class IamRole extends Resource {
  readonly ec2: CfnRole;
  readonly rds: CfnRole;

  constructor(scope: cdk.Construct) {
    super(scope);
    this.ec2 = this.create('ec2', {
      policyStatementProps: {
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('ec2.amazonaws.com')],
        actions: ['sts:AssumeRole']
      },
      managedPolicyArns: ['arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore']
    });
    this.rds = this.create('rds', {
      policyStatementProps: {
          effect: Effect.ALLOW,
          principals: [new ServicePrincipal('monitoring.rds.amazonaws.com')],
          actions: ['sts:AssumeRole']
      },
      managedPolicyArns: ['arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole']
    });
  }

  private create(nameSuffix: string, props: { policyStatementProps: PolicyStatementProps, managedPolicyArns: string[] }):CfnRole {
    const policyDocument = new PolicyDocument({
      statements: [new PolicyStatement(props.policyStatementProps)]
    });

    return new CfnRole(this.scope, `Role${upperCamelCase(nameSuffix)}`, {
      assumeRolePolicyDocument: policyDocument,
      managedPolicyArns: props.managedPolicyArns,
      roleName: this.makeName(`role-${nameSuffix}`)
    });
  }
}
