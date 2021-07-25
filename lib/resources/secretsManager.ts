import * as cdk from '@aws-cdk/core';
import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import { Resource } from './core/resource';

export class SecretsManager extends Resource {
  readonly rdsCluster: CfnSecret;

  constructor(scope: cdk.Construct) {
    super(scope);

    this.rdsCluster = new CfnSecret(this.scope, 'SecretsRdsCluster', {
      description: 'for RDS cluster',
      generateSecretString: {
        secretStringTemplate: '{"MasterUserName": "admin"}',
        generateStringKey: 'MasterUserPassword',
        passwordLength: 16,
        excludeCharacters: '"@/\\\''
      },
      name: this.makeName('secrets-rds-cluster')
    });
  }
}
