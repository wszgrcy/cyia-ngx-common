import { Repository1Module } from './repository-1/repository-1.module';
import { Repository1Component } from './repository-1/repository-1.component';
import { MonacoTextmate1Component } from './monaco-textmate-1/monaco-textmate-1.component';
import { MonacoTextmate1Module } from './monaco-textmate-1/monaco-textmate-1.module';
import { LoadingHint1Component } from './loading-hint-1/loading-hint-1.component';
import { LoadingHint1Module } from './loading-hint-1/loading-hint-1.module';
import { Type } from '@angular/core';
import { LazyLoadBaseComponent } from './lazy-load-base/lazy-load-base.component';
import { LazyLoadBaseModule } from './lazy-load-base/lazy-load-base.module';
import { Store1Component } from './store-1/store-1.component';
import { Store1Module } from './store-1/store-1.module';
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
  'loading-hint-1': {
    component: LoadingHint1Component,
    module: LoadingHint1Module,
  },
  'lazy-load-base': {
    component: LazyLoadBaseComponent,
    module: LazyLoadBaseModule,
  },
  'app-store-1': {
    component: Store1Component,
    module: Store1Module,
  },
};
