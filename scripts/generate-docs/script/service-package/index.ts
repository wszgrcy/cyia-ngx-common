import { Package } from 'dgeni';
import { HandlePackage } from '../handle-package';
import { serviceService } from './service.service';
import { ServiceProcessorFactory } from './service.processor';
import { SERVICE_TAG } from '../const/comment-tag';
import { TEMPLATE_PATH } from '../const/path';
import * as path from 'path';
import { SERVICE_DOC_TYPE } from '../const/doc-type';
import { AFTER_HANDLE } from '../const/run-time';
export const ServicePackage = new Package('service-package', [HandlePackage])
  .factory(serviceService)
  .processor(ServiceProcessorFactory)
  .config(function (parseTagsProcessor: any) {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([{ name: SERVICE_TAG }]);
  })
  .config(function (templateFinder) {
    templateFinder.templateFolders.unshift(path.resolve(TEMPLATE_PATH, 'service-page'));
    templateFinder.templatePatterns.unshift('<%= doc.docType %>.template.html');
  })
  .config(function (computePathsProcessor) {
    const list: any[] = computePathsProcessor.pathTemplates || [];
    list.push({
      docTypes: [SERVICE_DOC_TYPE],
      pathTemplate: '${name}',
      outputPathTemplate: '${name}.service.html',
    });

    computePathsProcessor.pathTemplates = list;
  });
