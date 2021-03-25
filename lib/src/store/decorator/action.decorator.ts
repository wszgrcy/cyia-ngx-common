import { CyiaStoreService } from '../store.service';
/**
 * 能直接定义action 并且直接调用
 * 将action和reducer二合一
 * 并且在select时提供默认的select
 */
export function NgrxAction() {
  return function (target: object, key: string, descriptor: PropertyDescriptor) {
    const classKey: any = target.constructor;
    const list = CyiaStoreService.actionConfigMap.get(classKey) || [];
    list.push({
      name: key,
      on: target[key],
    });
    CyiaStoreService.actionConfigMap.set(classKey, list);

    return descriptor;
  };
}
