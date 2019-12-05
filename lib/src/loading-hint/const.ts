import { CyiaLoadHintOption, CyiaLoadingHintUninstall, InstallConfig } from './type';

export const DEFAULT_INSTALL_CONFIG: InstallConfig = {
  uninstallMod: CyiaLoadingHintUninstall.default
};
export const CYIA_LOADING_HINT_CLOSE_FN = Symbol('CYIA_LOADING_HINT_CLOSE_FN');
export const CYIA_LOADING_HINT_COMPLETE$ = Symbol('CYIA_LOADING_HINT_COMPLETE$');
