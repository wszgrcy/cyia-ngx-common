import { Injectable, Injector, Compiler, Inject } from '@angular/core';
import { LAZY_LOAD_MAP } from './lazy-load-map.token';

/**
 * 懒加载组件服务,通过模块的forRoot传入相关懒加载模块配置
 * @docs-service
 * @author cyia
 * @date 2020-08-02
 * @export
 * @class LazyLoadService
 */
@Injectable({
  providedIn: 'root',
})
export class LazyLoadService {
  private loadingMap = new Map<string, Promise<void>>();
  constructor(
    private injector: Injector,
    private compiler: Compiler,
    @Inject(LAZY_LOAD_MAP) private map: Map<string, (injector: Injector, compiler: Compiler) => Promise<any>>
  ) {}
  load(key: string) {
    if (this.loadingMap.has(key)) {
      return this.loadingMap.get(key);
    }
    const loading = new Promise<any>((res, rej) => {
      if (!this.map.has(key)) {
        rej('没有找到相关懒加载模块');
      } else {
        res(this.map.get(key)(this.injector, this.compiler));
      }
    });
    this.loadingMap.set(key, loading);
    return loading;
  }
}
