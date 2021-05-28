import { InjectionToken, Type } from '@angular/core';
import { StoreBase } from './store.base';

export interface GenerateStoreConfig {
  /** 取自随机数 */
  name: string;
  type: Type<any>;
}
export interface GenerateActionConfig {
  /** 取自方法名 */
  name: string;
  on: Function;
}

export interface StoreModuleForRootOptions {
  token: InjectionToken<any>;
  stores: (any extends Type<StoreBase> ? Type<StoreBase> : never)[];
}
