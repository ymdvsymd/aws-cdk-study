import * as cdk from '@aws-cdk/core';
import * as Devio from '../lib/devio-stack';

let stack: Devio.DevioStack;
export function testTarget(): Devio.DevioStack {
  if (!stack) {
    const app = new cdk.App({
      context: {
        "systemName": "ymd",
        "evnType": "test"
      }
    });
    stack = new Devio.DevioStack(app, 'DevioStack');
  }

  return stack;
}
