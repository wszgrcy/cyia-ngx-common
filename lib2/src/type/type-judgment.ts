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
export class TypeJudgment {

    /**
     * 获得类型
     *
     * @static
     * @param {*} param 变量
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    static getType(param: any): jsNativeType {
        return this.transform2Enum(Object.prototype.toString.call(param))
    }

    private static transform2Enum(str: string): jsNativeType {
        let result = str.match(/^\[object ([A-Z][a-zA-Z]{1,10})\]$/)
        let type: jsNativeType;
        if (result)
            type = result[1] as jsNativeType;
        else
            type = jsNativeType.wrong
        return type;
    }

    /**
     *获得数组子元素的类型
     *
     * @static
     * @param {any[]} array
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    static getArrayType(array: any[]): jsNativeType {
        let preType: jsNativeType = jsNativeType.undefined;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            let type = this.getType(element)
            if (preType !== jsNativeType.undefined) {
                if (preType != type)
                    return jsNativeType.multi
            }
            else preType = type;
        }
        return preType;
    }
}