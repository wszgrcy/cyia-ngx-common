import { ViewContainerRef, Type, InjectionToken } from '@angular/core';
export type LoadingHintViewContainer = ViewContainerRef | 'root';
/**作为第二个参数 */
export interface CyiaLoadHintConfig {
  component?: Type<any>;
  // todo
  /**超时关闭 */
  timeout?: number;
  /**@deprecated 废弃属性 */
  uninstallMod?: CyiaLoadingHintUninstall;
  blockReturn?: boolean;
}
export enum CyiaLoadingHintUninstall {
  timeout = 0,
  component
}
/**内部不暴露的 */
export interface InstallConfig extends CyiaLoadHintConfig {
  container?: LoadingHintViewContainer;
  token?: InjectionToken<CyiaLoadHintConfig>;
}
export interface UnInstallConfig {
  container?: LoadingHintViewContainer;
  result?: any;
}
/**只传一个对象 */
export interface CyiaLoadHintOption extends CyiaLoadHintConfig {
  container?: ((type) => ViewContainerRef) | 'root';
}
