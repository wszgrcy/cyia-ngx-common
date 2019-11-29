import { ViewContainerRef, Type, InjectionToken } from '@angular/core';
export type LoadingHintContainer = ViewContainerRef | 'root';
/**作为第二个参数 */
export interface CyiaLoadHintConfig {
  component?: Type<any>;
  // todo
  duration?: number;
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
