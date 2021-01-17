import { Repository1Module } from './repository-1/repository-1.module';
import { Repository1Component } from './repository-1/repository-1.component';
import { MonacoTextmate1Component } from './monaco-textmate-1/monaco-textmate-1.component';
import { MonacoTextmate1Module } from './monaco-textmate-1/monaco-textmate-1.module';
import { Type } from '@angular/core';
export const EXAMPLE_GROUP: {
  [name: string]: {
    component: Type<any>;
    module: Type<any>;
  };
} = {
  'repository-1': { component: Repository1Component, module: Repository1Module },
  'monaco-textmate-1': {
    component: MonacoTextmate1Component,
    module: MonacoTextmate1Module,
  },
};
