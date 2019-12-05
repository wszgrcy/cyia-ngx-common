import { TypeJudgment, jsNativeType } from './../type/type-judgment';
/**
 * 目前只会对对象合并,数组仍会是替换
 * @param  obj 接收的对象
 * @param  obj2 要放进去的对象
 */
export function _deepCloneObject<T>(obj: any, ...objArray: Object[]): T {
    objArray.forEach((obj2Mixin) => {
        for (const x in obj2Mixin) {
            if (!obj2Mixin.hasOwnProperty(x)) { continue; }
            if (TypeJudgment.getType(obj2Mixin[x]) === jsNativeType.object) {// 如果是对象
                if (!obj[x]) { obj[x] = {}; }
                _deepCloneObject(obj[x], obj2Mixin[x]);
            } else if (obj2Mixin[x] !== undefined) {
                obj[x] = obj2Mixin[x];
            }

        }
    });
    return obj;
}
