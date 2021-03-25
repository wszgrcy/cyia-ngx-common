import { CyiaStoreService } from '../store.service';
import { Type } from '@angular/core';
export function NgrxStore() {
  return function (target: Type<any>) {
    CyiaStoreService.storeConfigMap.set(target, { name: Math.random().toString(36), type: target });
  };
}
