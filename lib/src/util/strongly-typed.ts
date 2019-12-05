import { Type } from '@angular/core';

/**
 * 强类型化,不会查找原型链上的属性
 *
 * @export
 * @template T
 */
// export function stronglyTyped<T>(data: any, entity: Type<T>): T;
export function stronglyTyped<T, D>(data: D, entity: Type<T>): D extends Array<any> ? T[] : T {
  if (data instanceof Array) {
    return data.map(item => _stronglyTypedSingle(item, entity)) as any;
  }
  return _stronglyTypedSingle(data, entity) as any;
}
function _stronglyTypedSingle<T>(data, entity: Type<T>) {
  const instance = new entity();
  for (const x in data) {
    if (!data.hasOwnProperty(x)) {
      continue;
    }
    instance[x] = data[x];
  }
  return instance;
}
