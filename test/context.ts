import * as cdk from '@aws-cdk/core';
import * as Devio from '../lib/devio-stack';

export function createTestTarget(): Devio.DevioStack {
  const app = new cdk.App({
    context: {
      "systemName": "ymd",
      "evnType": "test"
    }
  });
  return new Devio.DevioStack(app, 'DevioStack');
}
