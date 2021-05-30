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
import { ɵisPromise, ɵisObservable } from '@angular/core';
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
  const actionConfigList: GenerateActionConfig[] = [];
  while (type) {
    actionConfigList.push(...(CyiaStoreService.actionConfigMap.get(type) || []));
    type = Object.getPrototypeOf(type);
  }
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
      if (ɵisPromise(result)) {
        result.then((res) => {
          instance.promiseReturn(res);
        });
      } else if (ɵisObservable(result)) {
        result.subscribe((res) => {
          instance.observableReturn(res);
        });
      } else {
        instance.state = result;
        return result;
      }
      instance.pending = true;
      return instance.state;
    });
  });
  instance.storeInit = (store, featureName) => {
    memberHookList.forEach((item) => {
      instance[item.name] = (arg: any) => {
        store.dispatch(item.action({ value: arg }));
      };
    });
    if (featureName) {
      instance.state$ = store.select(featureName, storeConfig.name);
    } else {
      instance.state$ = store.select(storeConfig.name);
    }
  };
  return (map: ActionReducerMap<any, any>) => {
    map[storeConfig.name] = rxCreateReducer(instance.initState, ...onList);
    return map;
  };
}
