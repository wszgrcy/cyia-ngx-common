import { Injectable, Type } from '@angular/core';
import {
  ReducerTypes,
  createAction,
  props,
  on,
  createReducer as rxCreateReducer,
  ActionReducerMap,
  Action,
  ActionCreator,
} from '@ngrx/store';
import { GenerateStoreConfig, GenerateActionConfig } from './store.types';
import { generateActionName } from './store.helper';
import { StoreBase } from './store.base';
export class CyiaStoreService {
  static storeConfigMap = new Map<Type<StoreBase>, GenerateStoreConfig>();
  static actionConfigMap = new Map<Type<StoreBase>, GenerateActionConfig[]>();
}

export function createReducer(instance: StoreBase) {
  /** 服务实例 */
  let type: Type<any> = (instance as any)?.__proto__?.constructor || Object.getPrototypeOf(instance).constructor;
  if (!type) {
    type = [...CyiaStoreService.storeConfigMap].find(([Type]) => instance instanceof Type)[0];
  }
  if (!type) {
    throw new Error(`${instance}原型未找到`);
  }
  const storeConfig = CyiaStoreService.storeConfigMap.get(type);
  if (!storeConfig) {
    throw new Error(`${type.name}未使用[NgrxStore]装饰器`);
  }
  const actionConfigList = CyiaStoreService.actionConfigMap.get(type) || [];
  const memberHookList: { name: string; action: ActionCreator<string, (props: any) => any> }[] = [];
  const onList: ReducerTypes<any, any>[] = actionConfigList.map((item) => {
    const ACTION_NAME = generateActionName(storeConfig.name, item.name);
    const action = createAction(ACTION_NAME, props<any>());
    instance[item.name] = () => {
      console.warn('服务未初始化store', item.name);
    };
    memberHookList.push({ name: item.name, action });
    return on(action, (state, action) => {
      instance.state = state;
      const result = item.on.bind(instance)(action.value);
      instance.state = result;
      return result;
    });
  });
  instance.storeInit = (store) => {
    memberHookList.forEach((item) => {
      instance[item.name] = (arg: any) => {
        store.dispatch(item.action({ value: arg }));
      };
    });
    instance.state$ = store.select(storeConfig.name);
  };
  return (map: ActionReducerMap<any, any>) => {
    map[storeConfig.name] = rxCreateReducer(instance.initState, ...onList);
    return map;
  };
}
