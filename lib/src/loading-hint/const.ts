import { CyiaLoadHintOption, CyiaLoadingHintUninstall, InstallConfig } from './type';

export const DEFAULT_INSTALL_CONFIG: InstallConfig = {
  uninstallMod: CyiaLoadingHintUninstall.default,
  delay: 0
};
export const CYIA_LOADING_HINT_CLOSE_FN = Symbol('CYIA_LOADING_HINT_CLOSE_FN');
export const CYIA_LOADING_HINT_PROGRESS_FN = Symbol('CYIA_LOADING_HINT_CLOSE_FN');
export const CYIA_LOADING_HINT_RESULT$ = Symbol('CYIA_LOADING_HINT_COMPLETE$');
