import { Injectable, Type } from '@angular/core';
import {
  Store,
  createFeatureSelector,
  select,
  ReducerTypes,
  createAction,
  props,
  on,
  createReducer,
  ActionCreator,
} from '@ngrx/store';
import { GenerateStoreConfig, GenerateActionConfig, StoreBase } from './store.types';
import { generateActionName } from './store.helper';
import { Observable } from 'rxjs';

@Injectable()
export class CyiaStoreService {
  static storeConfigMap = new Map<Type<StoreBase>, GenerateStoreConfig>();
  static actionConfigMap = new Map<Type<StoreBase>, GenerateActionConfig[]>();
  static storeActionCreatorMap = new Map<Type<StoreBase>, Map<string, ActionCreator<string, (props: any) => any>>>();
  static storeMap = new Map<Type<any>, StoreBase>();
  static createReducer(
    actionsConfig: GenerateActionConfig[],
    storeConfig: GenerateStoreConfig,
    initState: any,
    instance: StoreBase
  ) {
    const actionCreatorMap = new Map();
    const onList: ReducerTypes<any, any>[] = actionsConfig.map((item) => {
      const ACTION_NAME = generateActionName(storeConfig.name, item.name);
      const action = createAction(ACTION_NAME, props<any>());

      actionCreatorMap.set(ACTION_NAME, action);
      return on(action, (state, action) => {
        instance.state = state;
        return item.on.bind(instance)(action.value);
      });
    });
    this.storeActionCreatorMap.set(storeConfig.type, actionCreatorMap);
    return createReducer(initState, ...onList);
  }

  constructor(private store: Store) {}
  getStore<T extends StoreBase>(type: Type<T>): T {
    const storeConfig = CyiaStoreService.storeConfigMap.get(type);
    const instance = CyiaStoreService.storeMap.get(type);
    const actionCreatorMap = CyiaStoreService.storeActionCreatorMap.get(type);
    CyiaStoreService.actionConfigMap.get(type).forEach((cur) => {
      instance[cur.name] = (action) => {
        const actionCreator = actionCreatorMap.get(storeConfig.name + cur.name);
        this.store.dispatch(actionCreator({ value: action }));
      };
    });
    return instance as any;
  }
  select<T extends StoreBase>(type: Type<T>): Observable<T['state']> {
    const storeConfig = CyiaStoreService.storeConfigMap.get(type);
    return this.store.pipe(select(createFeatureSelector(storeConfig.name)));
  }

  getReducerName<T extends StoreBase>(type: Type<T>) {
    return CyiaStoreService.storeConfigMap.get(type).name;
  }
}

export function getReducerMap(types: Type<StoreBase>[]) {
  return types.reduce((pre: Record<string, any>, Type) => {
    const storeConfig = CyiaStoreService.storeConfigMap.get(Type);
    const actionConfigList = CyiaStoreService.actionConfigMap.get(Type);
    const instance = new Type();
    const reducer = CyiaStoreService.createReducer(actionConfigList, storeConfig, instance.initState, instance);
    CyiaStoreService.storeMap.set(Type, instance);
    pre[storeConfig.name] = reducer;
    return pre;
  }, {});
}
export function serviceToStore(serviceInstance: any) {
  const name = serviceInstance.name || (serviceInstance as any).__proto__.constructor.name;
  const reducer = serviceInstance.createReducer();
}

export function newCreateReducer(instance) {
  const type = instance.__proto__.constructor;
  const storeConfig = CyiaStoreService.storeConfigMap.get(type);
  const actionConfigList = CyiaStoreService.actionConfigMap.get(type);
  const reducer = CyiaStoreService.createReducer(actionConfigList, storeConfig, instance.initState, instance);
  return reducer;
}
