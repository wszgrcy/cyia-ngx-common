export function CloneParam<T>() {

    return (target: T, propertyKey: string, descriptor: PropertyDescriptor) => {
        let fn: Function = descriptor.value;
        descriptor.value = function (...params) {
            //TODO 深拷贝
            params = Object.assign({}, params)
            return fn.apply(this, ...params)
        }
        return descriptor
    }

}