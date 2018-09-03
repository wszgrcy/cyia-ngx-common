"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_judgment_1 = require("./../type/type-judgment");
/**
 * 目前只会对对象合并,数组仍会是替换
 * @param {*} obj 接收的对象
 * @param {*} obj2 要放进去的对象
 */
function _deepAssign(obj) {
    var objArray = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objArray[_i - 1] = arguments[_i];
    }
    objArray.forEach(function (obj2Mixin) {
        for (var x in obj2Mixin) {
            if (obj2Mixin.hasOwnProperty(x))
                if (type_judgment_1.TypeJudgment.getType(obj2Mixin[x]) === type_judgment_1.jsNativeType.object) { //如果是对象
                    if (!obj[x])
                        obj[x] = {};
                    _deepAssign(obj[x], obj2Mixin[x]);
                }
                else if (obj2Mixin[x] != undefined) {
                    obj[x] = obj2Mixin[x];
                }
        }
    });
    return obj;
}
exports._deepAssign = _deepAssign;
//# sourceMappingURL=deepassign.js.map