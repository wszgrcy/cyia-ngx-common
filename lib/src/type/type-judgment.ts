export enum jsNativeType {
  function = 'Function',
  array = 'Array',
  string = 'String',
  bool = 'Boolean',
  number = 'Number',
  math = 'Math',
  date = 'Date',
  regexp = 'RegExp',
  error = 'Error',
  json = 'JSON',
  arguments = 'Arguments',
  object = 'Object',
  wrong = 'WRONG',
  null = 'Null',
  undefined = 'Undefined',
  multi = 'Multi',
  window = 'Window'
}

/**判断类型 */
export namespace TypeJudgment {
  /**
   * 获得类型
   *
   *
   * @param  param 变量
   * @returns
   * @memberof TypeJudgment
   */
  export function getType(param: any): jsNativeType {
    return TypeJudgment.transform2Enum(Object.prototype.toString.call(param));
  }

  export function transform2Enum(str: string): jsNativeType {
    const result = str.match(/^\[object ([A-Z][a-zA-Z]{1,10})\]$/);
    let type: jsNativeType;
    if (result) {
      type = result[1] as jsNativeType;
    } else {
      type = jsNativeType.wrong;
    }
    return type;
  }

  /**
   *获得数组子元素的类型
   *
   *
   * @param  array
   * @returns
   * @memberof TypeJudgment
   */
  export function getArrayType(array: any[]): jsNativeType {
    let preType: jsNativeType = jsNativeType.undefined;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      const type = this.getType(element);
      if (preType !== jsNativeType.undefined) {
        if (preType !== type) {
          return jsNativeType.multi;
        }
      } else {
        preType = type;
      }
    }
    return preType;
  }
}
