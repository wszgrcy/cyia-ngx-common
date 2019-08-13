import { Type } from "@angular/core";

/**
 * 强类型化
 *
 * @export
 * @template T
 * @param {*} data
 * @param {Type<T>} entity
 * @returns {T}
 */
// export function stronglyTyped<T>(data: any, entity: Type<T>): T;
export function stronglyTyped<T, D>(data: D, entity: Type<T>): T[] | T {
  if (data instanceof Array) {
    return data.map((item) => _stronglyTypedSingle(item, entity))
  }
  return _stronglyTypedSingle(data, entity) as any
}
function _stronglyTypedSingle<T>(data, entity: Type<T>) {
  let instance = new entity()
  for (const x in data) {
    if (!data.hasOwnProperty(x)) continue
    instance[x] = data[x]
  }
  return instance
}
