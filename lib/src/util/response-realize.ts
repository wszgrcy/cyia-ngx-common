import { Type } from "@angular/core";

/**
 * 强类型话
 *
 * @export
 * @template T
 * @param {*} object
 * @param {Type<T>} entity
 * @returns {T}
 */
export function stronglyTyped<T>(object, entity: Type<T>): T {
  console.log(entity);
  let instance = new entity()
  for (const x in object) {
    if (!object.hasOwnProperty(x)) continue
    instance[x] = object[x]
  }
  return instance
}
