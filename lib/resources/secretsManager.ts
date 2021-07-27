import * as cdk from '@aws-cdk/core';
import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import { Resource } from './core/resource';

type SecretKey = 'MasterUserName' | 'MasterUserPassword';

export class SecretsManager extends Resource {
  readonly rdsCluster: CfnSecret;

  constructor(scope: cdk.Construct) {
    super(scope);
    this.rdsCluster = new CfnSecret(this.scope, 'SecretsRdsCluster', {
      description: 'for RDS cluster',
      generateSecretString: {
        secretStringTemplate: `{"${<SecretKey>'MasterUserName'}": "admin"}`,
        generateStringKey: <SecretKey>'MasterUserPassword',
        passwordLength: 16,
        excludeCharacters: '"@/\\\''
      },
      name: this.makeName('secrets-rds-cluster')
    });
  }

  private static getDynamicReference(secret: CfnSecret, secretKey: SecretKey): string {
    return `{{resolve:secretsmanager:${secret.ref}:SecretString:${secretKey}}}`;
  }

  public get masterUserName() {
    return SecretsManager.getDynamicReference(this.rdsCluster, 'MasterUserName');
  }

  public get masterUserPassword() {
    return SecretsManager.getDynamicReference(this.rdsCluster, 'MasterUserPassword');
  }
}
