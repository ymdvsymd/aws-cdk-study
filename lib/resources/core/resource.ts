import * as cdk from '@aws-cdk/core';

export abstract class Resource {
  protected readonly scope: cdk.Construct;

  private readonly systemName: string;
  private readonly envType: string;

  constructor(scope: cdk.Construct) {
    this.scope = scope;
    this.systemName = this.scope.node.tryGetContext('systemName');
    this.envType = this.scope.node.tryGetContext('evnType');
  }

  protected getFullName(name: string): string {
    return `${this.systemName}-${this.envType}-${name}`
  }
}
