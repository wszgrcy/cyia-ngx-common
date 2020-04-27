import { Package } from 'dgeni';
import { DocsDataPackage } from '../docs-data-package';
import { TEMPLATE_PATH } from '../const/path';
import * as path from 'path';
import { SERVICE_DOC_TYPE, MODULE_DOC_TYPE, DECORATOR_DOC_TYPE } from '../const/doc-type';
import { exportSpecifiedDocsProcessor } from './export-specified-docs.processor';
export const BUILD_PACKAGE = new Package('build-package', [DocsDataPackage])
  .processor(exportSpecifiedDocsProcessor)
  .config(function (templateFinder) {
    templateFinder.templateFolders.unshift(path.resolve(TEMPLATE_PATH, 'type-page'));
    templateFinder.templateFolders.unshift(path.resolve(TEMPLATE_PATH, 'decorator-page'));
    templateFinder.templateFolders.unshift(path.resolve(TEMPLATE_PATH, 'module-page'));
    templateFinder.templateFolders.unshift(path.resolve(TEMPLATE_PATH, 'service-page'));
    templateFinder.templatePatterns.unshift('<%= doc.docType %>.template.html');
    // templateFinder.templatePatterns.unshift('decorator.template.html');
  })
  .config(function (computePathsProcessor) {
    const list: any[] = computePathsProcessor.pathTemplates || [];
    list.push({
      docTypes: [DECORATOR_DOC_TYPE],
      pathTemplate: '${name}',
      outputPathTemplate: '${name}.decorator.html',
    });
    list.push({
      docTypes: [MODULE_DOC_TYPE],
      pathTemplate: '${name}',
      outputPathTemplate: '${name}.module.html',
    });
    list.push({
      docTypes: [SERVICE_DOC_TYPE],
      pathTemplate: '${name}',
      outputPathTemplate: '${name}.service.html',
    });
    computePathsProcessor.pathTemplates = list;
  });
