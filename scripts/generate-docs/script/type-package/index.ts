import { Package } from 'dgeni';
import { TypeProcessorFactory } from './type.processor';
import { typeService } from './type.service';
import { BasePackage } from '../base-package';
import { TEMPLATE_PATH } from '../const/path';
import * as path from 'path';
export const TypePackage = new Package('type-definition', [BasePackage])
  .factory(typeService)
  .processor(TypeProcessorFactory)
  .config(function (templateFinder) {
    templateFinder.templateFolders.unshift(path.resolve(TEMPLATE_PATH, 'type-page'));
    // templateFinder.templatePatterns.unshift('decorator.template.html');
  });
