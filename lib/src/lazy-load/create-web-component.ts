import { Injector, Compiler, NgModuleFactory, Type } from '@angular/core';
import { createCustomElement } from '@angular/elements';

/**
 *
 *
 * @author cyia
 * @date 2020-08-02
 * @export
 * @template T
 * @param injector
 * @param compiler
 * @param module 模块需要定义一个entry属性,赋值为想要生成为web-component的组件
 * @param selector 需要定义web-component组件的标签名(组件生成web-component时,原来的selector无效)
 */
export function createWebComponent<T>(injector: Injector, compiler: Compiler, module: Type<T>, selector: string) {
  let factory: NgModuleFactory<any>;
  if (module instanceof NgModuleFactory) {
    factory = module as any;
  } else {
    factory = compiler.compileModuleSync(module);
  }
  const moduleRef = factory.create(injector);
  const el = createCustomElement(moduleRef.instance.entry, { injector: moduleRef.injector });
  customElements.define(selector, el);
}
