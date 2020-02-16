import { ViewContainerRef, Type, InjectionToken } from '@angular/core';
export type LoadingHintViewContainer = ViewContainerRef | 'root';
/**作为第二个参数 */
export interface CyiaLoadHintConfig {
  component?: Type<any>;
  /**超时关闭 */
  timeout?: number;
  /**返回后延时时间 */
  delay?: number;
  /**指定持续时间模式使用 */
  duration?: number;
  uninstallMod?: CyiaLoadingHintUninstall;
  /**
   * false数据直接返回,但是仍然保留加载组件显示
   * true 直至组件关闭后,才会返回
   * 卸载模式
   * default,无意义
   * component,组件可以控制关闭
   * duration,无前置条件
   */
  blockReturn?: boolean;
}
export enum CyiaLoadingHintUninstall {
  default = 0,
  component,
  duration
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
