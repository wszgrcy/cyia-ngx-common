import { Package } from 'dgeni';
import { MODULE_TAG } from '../const/comment-tag';
import { TEMPLATE_PATH } from '../const/path';
import * as path from 'path';
import { MODULE_DOC_TYPE } from '../const/doc-type';
import { ServicePackage } from '../service-package';
import { moduleService } from './module.service';
import { ModuleProcessorFactory } from './module.processor';
export const ModulePackage = new Package('module-package', [ServicePackage])
  .factory(moduleService)
  .processor(ModuleProcessorFactory)
  .config(function (parseTagsProcessor: any) {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([{ name: MODULE_TAG }]);
  })
  .config(function (templateFinder) {
    templateFinder.templateFolders.unshift(path.resolve(TEMPLATE_PATH, 'module-page'));
    templateFinder.templatePatterns.unshift('<%= doc.docType %>.template.html');
  })
  .config(function (computePathsProcessor) {
    const list: any[] = computePathsProcessor.pathTemplates || [];
    list.push({
      docTypes: [MODULE_DOC_TYPE],
      pathTemplate: '${name}',
      outputPathTemplate: '${name}.module.html',
    });

    computePathsProcessor.pathTemplates = list;
  });
