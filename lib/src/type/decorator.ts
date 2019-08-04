export interface MethodDecoratorFactory {
    (...param): (target, name: string, descriptor: PropertyDescriptor) => {}
}