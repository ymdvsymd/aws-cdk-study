import { expect, countResources, haveResource } from '@aws-cdk/assert';
import { testTarget } from '../context'

test('SecretsManager', () => {
  const stack = testTarget();

    expect(stack).to(countResources('AWS::SecretsManager::Secret', 1));
    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
        Description: 'for RDS cluster',
        GenerateSecretString: {
            ExcludeCharacters: '"@/\\\'',
            GenerateStringKey: 'MasterUserPassword',
            PasswordLength: 16,
            SecretStringTemplate: '{"MasterUserName": "admin"}'
        },
        Name: 'ymd-test-secrets-rds-cluster'
    }));
});
