import { ViewContainerRef, Type, InjectionToken } from '@angular/core';
export type LoadingHintContainer = ViewContainerRef | 'root';
export interface CyiaLoadHintConfig {
  // container?: LoadingHintContainer;
  component?: Type<any>;
  timeout?: number;

}
export interface InstallConfig extends CyiaLoadHintConfig {
  container?: LoadingHintContainer;
  token?: InjectionToken<CyiaLoadHintConfig>;
  // component: Type<any>;
  // timeout?: number;
}
export interface CyiaLoadHintOption {
  container?: (type) => ViewContainerRef | 'root';
  loadingHintComponent?: Type<any>;
  timeout?: number;
}
