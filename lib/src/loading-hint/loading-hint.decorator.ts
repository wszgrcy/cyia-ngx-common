import { LoadingHintService } from './loading-hint.service';
import { ɵisPromise, ɵisSubscribable, Type, ViewContainerRef, InjectionToken } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { CyiaLoadHintConfig, CyiaLoadHintOption, LoadingHintViewContainer, InstallConfig } from './type';
import { DEFAULT_INSTALL_CONFIG } from './const';
import { Observable, firstValueFrom } from 'rxjs';
/**
 * @docs-decorator
 * @description 载入提示装饰器
 * @author cyia
 * @date 2020-07-21
 * @export
 * @template T
 * @param option
 */
export function LoadingHint<T = any>(option: CyiaLoadHintOption);
export function LoadingHint<T = any>(
  container: 'root' | ((type: T) => ViewContainerRef),
  config?: Type<any> | CyiaLoadHintConfig | InjectionToken<CyiaLoadHintConfig>
);
export function LoadingHint<T = any>(
  arg1: CyiaLoadHintOption | ((type: T) => ViewContainerRef) | 'root',
  arg2?: Type<any> | CyiaLoadHintConfig | InjectionToken<CyiaLoadHintConfig>
) {
  return function (target, key: string, property: PropertyDescriptor) {
    const fn: Function = property.value;
    property.value = function () {
      const LOADING_HINT_KEY = Symbol(Date.now());
      const installConfig = getInstallConfig.call(this, arg1, arg2);
      LoadingHintService.install(LOADING_HINT_KEY, installConfig);

      const res = fn.apply(this, arguments);
      if (ɵisPromise(res)) {
        return res.then((value) => {
          return firstValueFrom(LoadingHintService.uninstall(LOADING_HINT_KEY, installConfig.container, value));
        });
      } else if (ɵisSubscribable(res)) {
        return (res as Observable<any>).pipe(
          switchMap((value) => LoadingHintService.uninstall(LOADING_HINT_KEY, installConfig.container, value))
        );
      }
      return res;
    };

    return property;
  };
}
function getInstallConfig<T>(
  arg1: CyiaLoadHintOption | ((type: T) => ViewContainerRef) | 'root',
  arg2?: Type<any> | CyiaLoadHintConfig | InjectionToken<CyiaLoadHintConfig>
): InstallConfig {
  let container: LoadingHintViewContainer;
  let otherParam = {};
  let component: Type<any>;
  // doc container
  if (typeof arg1 === 'string' && arg1 === 'root') {
    container = arg1;
  } else if (typeof arg1 === 'function') {
    container = arg1(this);
  } else if (typeof arg1 === 'object') {
    container = arg1.container instanceof Function ? arg1.container(this) : arg1.container;
    otherParam = arg1;
    ({ component } = arg1);
  }
  // doc component
  if (arg2 && arg2.hasOwnProperty('component')) {
    component = (arg2 as any).component;
    otherParam = arg2;
  } else if (arg2 && !(arg2 instanceof InjectionToken)) {
    component = arg2 as any;
  }
  return {
    ...DEFAULT_INSTALL_CONFIG,
    ...otherParam,
    container,
    component,
    token: arg2 instanceof InjectionToken ? arg2 : undefined,
  };
}
