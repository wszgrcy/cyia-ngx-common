import { ViewContainerRef, Type, InjectionToken } from '@angular/core';
export type LoadingHintContainer = ViewContainerRef | 'root';
/**作为第二个参数 */
export interface CyiaLoadHintConfig {
  component?: Type<any>;
  // todo
  /**持续时间(代替自动关闭使用) */
  duration?: number;
  /**超时关闭 */
  timeout?: number;
  closeMod?: CyiaLoadingHintClose;
}
export enum CyiaLoadingHintClose {
  default = 0,
  duration,
  component
}
/**内部不暴露的 */
export interface InstallConfig extends CyiaLoadHintConfig {
  container?: LoadingHintContainer;
  token?: InjectionToken<CyiaLoadHintConfig>;
}
/**只传一个对象 */
export interface CyiaLoadHintOption extends CyiaLoadHintConfig {
  container?: (type) => ViewContainerRef | 'root';
}
