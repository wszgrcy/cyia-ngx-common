interface ClickControlFunction extends Function {
    isClickControl: boolean
}

type ControlMethod = 'time' | 'async' | 'sync'
interface ControlConfig { method?: ControlMethod, time?: number, referenceResult?: boolean, failFallback?: boolean, }
const CONTROL_CONFIG: any = { method: 'time', time: 3000, referenceResult: false, failFallback: true }
export function CallControl(config: ControlConfig = CONTROL_CONFIG) {
    let { method, time, referenceResult, failFallback }: ControlConfig = Object.assign({}, CONTROL_CONFIG, config)
    return (target, name: string, descriptor: PropertyDescriptor) => {
        let fn: ClickControlFunction = descriptor.value;
        descriptor.value = function (...param) {
            if (!fn.isClickControl) {
                fn.isClickControl = true
                if (method === 'time') setTimeout(() => fn.isClickControl = false, time);
            } else if (fn.isClickControl) {
                return
            }
            let value = fn.apply(this, ...param)
            if (method === 'sync') {
                fn.isClickControl = referenceResult ? !value : false;
                if (failFallback && fn.isClickControl) {
                    setTimeout(() => fn.isClickControl = false, time);
                }
                return value
            }
            else if (method === 'async') {
                return value.then((value) => {
                    fn.isClickControl = referenceResult ? !value : false;
                    if (failFallback && fn.isClickControl) {
                        setTimeout(() => fn.isClickControl = false, time);
                    }
                    return value
                })
            }
            else
                return value
        }

        return descriptor
    }
}