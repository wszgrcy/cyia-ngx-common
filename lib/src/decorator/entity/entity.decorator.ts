import { CyiaHttpService } from "../../http/http.service";
import { EntityOptions } from "../../type/options/entity.options";
export function Entity(options: EntityOptions) {
    return function (constructor) {
        console.log('注册实体',constructor);
        CyiaHttpService.registerEntity({
            entity: constructor,
            options: Object.assign(new EntityOptions(), options)
        })
    }
}
