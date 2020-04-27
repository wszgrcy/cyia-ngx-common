import { Package } from 'dgeni';
import { HandlePackage } from '../handle-package';
import { DecoratorDocsProcessorFactory } from './decorator-docs.processor';
import { DECORATOR_DOC_TYPE } from '../const/doc-type';
import { TEMPLATE_PATH } from '../const/path';
import * as path from 'path';
import { DECORATOR_TAG } from '../const/comment-tag';
import { decoratorService } from './decorator.service';
export const DecoratorPackage = new Package('decorator', [HandlePackage])
  .factory(decoratorService)
  .processor(DecoratorDocsProcessorFactory)
  .config(function (computePathsProcessor) {
    const list: any[] = computePathsProcessor.pathTemplates || [];
    list.push({
      docTypes: [DECORATOR_DOC_TYPE],
      pathTemplate: '${name}',
      outputPathTemplate: '${name}.decorator.html',
    });

    computePathsProcessor.pathTemplates = list;
  })
  .config(function (templateFinder) {
    templateFinder.templateFolders.unshift(path.resolve(TEMPLATE_PATH, 'decorator-page'));
    templateFinder.templatePatterns.unshift('<%= doc.docType %>.template.html');
  })
  .config(function (parseTagsProcessor: any) {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([{ name: DECORATOR_TAG }]);
  });
