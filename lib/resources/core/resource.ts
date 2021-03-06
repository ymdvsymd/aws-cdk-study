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

  protected makeName(nameSuffix: string): string {
    return `${this.systemName}-${this.envType}-${nameSuffix}`
  }

  protected makeNameTag(nameSuffix: string): cdk.CfnTag {
    return { key: 'Name', value: this.makeName(nameSuffix) }
  }
}
