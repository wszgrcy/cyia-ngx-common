import { InjectionToken, Type } from '@angular/core';

export interface GenerateStoreConfig {
  name: string;
  type: Type<any>;
}
export interface GenerateActionConfig {
  name: string;
  on: Function;
}
export interface StoreBase<T = any> {
  readonly initState?: T;
  state: T;
  readonly name?: string;
}

export interface StoreModuleForRootOptions {
  token: InjectionToken<any>;
  stores: any[];
}
