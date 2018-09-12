export declare enum jsNativeType {
    function = "Function",
    array = "Array",
    string = "String",
    bool = "Boolean",
    number = "Number",
    math = "Math",
    date = "Date",
    regexp = "RegExp",
    error = "Error",
    json = "JSON",
    arguments = "Arguments",
    object = "Object",
    wrong = "WRONG",
    null = "Null",
    undefined = "Undefined",
    multi = "Multi",
    window = "Window"
}
/**判断类型 */
export declare class TypeJudgment {
    /**
     * 获得类型
     *
     * @static
     * @param {*} param 变量
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    static getType(param: any): jsNativeType;
    private static transform2Enum;
    /**
     *获得数组子元素的类型
     *
     * @static
     * @param {any[]} array
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    static getArrayType(array: any[]): jsNativeType;
}
