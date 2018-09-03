"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsNativeType;
(function (jsNativeType) {
    jsNativeType["function"] = "Function";
    jsNativeType["array"] = "Array";
    jsNativeType["string"] = "String";
    jsNativeType["bool"] = "Boolean";
    jsNativeType["number"] = "Number";
    jsNativeType["math"] = "Math";
    jsNativeType["date"] = "Date";
    jsNativeType["regexp"] = "RegExp";
    jsNativeType["error"] = "Error";
    jsNativeType["json"] = "JSON";
    jsNativeType["arguments"] = "Arguments";
    jsNativeType["object"] = "Object";
    jsNativeType["wrong"] = "WRONG";
    jsNativeType["null"] = "Null";
    jsNativeType["undefined"] = "Undefined";
    jsNativeType["multi"] = "Multi";
    jsNativeType["window"] = "Window";
})(jsNativeType = exports.jsNativeType || (exports.jsNativeType = {}));
/**判断类型 */
var TypeJudgment = /** @class */ (function () {
    function TypeJudgment() {
    }
    /**
     * 获得类型
     *
     * @static
     * @param {*} param 变量
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    TypeJudgment.getType = function (param) {
        return this.transform2Enum(Object.prototype.toString.call(param));
    };
    TypeJudgment.transform2Enum = function (str) {
        var result = str.match(/^\[object ([A-Z][a-zA-Z]{1,10})\]$/);
        var type;
        if (result)
            type = result[1];
        else
            type = jsNativeType.wrong;
        return type;
    };
    /**
     *获得数组子元素的类型
     *
     * @static
     * @param {any[]} array
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    TypeJudgment.getArrayType = function (array) {
        var preType = jsNativeType.undefined;
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var type = this.getType(element);
            if (preType !== jsNativeType.undefined) {
                if (preType != type)
                    return jsNativeType.multi;
            }
            else
                preType = type;
        }
        return preType;
    };
    return TypeJudgment;
}());
exports.TypeJudgment = TypeJudgment;
//# sourceMappingURL=type-judgment.js.map