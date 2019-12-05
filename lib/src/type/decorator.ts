export type MethodDecoratorFactory = (...param) => (target, name: string, descriptor: PropertyDescriptor) => {};
