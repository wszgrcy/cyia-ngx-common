import { Package } from 'dgeni';
import { handleParameters } from './util/handle-parameters';
import { TypePackage } from './type-package';
import { BasePackage } from './base-package';
export const HandlePackage = new Package('handle-package', [BasePackage, TypePackage]).factory(handleParameters);
