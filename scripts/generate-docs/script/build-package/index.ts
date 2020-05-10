import { Package } from 'dgeni';
import { DocsDataPackage } from '../docs-data-package';
import { TEMPLATE_PATH } from '../const/path';
import * as path from 'path';
import { SERVICE_DOC_TYPE, MODULE_DOC_TYPE, DECORATOR_DOC_TYPE, API_DOC_TYPE } from '../const/doc-type';
import { exportSpecifiedDocsProcessor } from './export-specified-docs.processor';
import { DocModule } from '../define/doc-module';
import { MarkdownNunjucksExtension } from './markdown.nunjucks.extension';
import { mergeApiDocsProcess } from './merge-api-docs.processor';
/**输出文件 */
export const BUILD_PACKAGE = new Package('build-package', [DocsDataPackage])
  // .processor(exportSpecifiedDocsProcessor)
  .processor(mergeApiDocsProcess)
  .config(function (templateFinder) {
    // doc 设置查找模板
    templateFinder.templateFolders = [
      path.resolve(TEMPLATE_PATH, 'type-page'),
      path.resolve(TEMPLATE_PATH, 'common'),
      path.resolve(TEMPLATE_PATH, 'service-page'),
      path.resolve(TEMPLATE_PATH, 'decorator-page'),
      path.resolve(TEMPLATE_PATH, 'overview-page'),
      path.resolve(TEMPLATE_PATH, 'api-page'),
    ];
    templateFinder.templatePatterns = ['${doc.templatename}.template.html'];
  })
  .config(function (computePathsProcessor) {
    // doc 输出路径计算
    computePathsProcessor.pathTemplates = [
      {
        docTypes: [MODULE_DOC_TYPE],
        pathTemplate: '${name}',
        // outputPathTemplate: '${name}.decorator.html',
        getOutputPath: (doc: DocModule) => {
          return `overview/${doc.folder}.overview.html`;
        },
      },
      {
        docTypes: [API_DOC_TYPE],
        pathTemplate: '${name}',
        // outputPathTemplate: '${name}.decorator.html',
        getOutputPath: (doc: DocModule) => {
          return `api/${doc.folder}.api.html`;
        },
      },
    ];
  })
  .config(function (templateEngine) {
    templateEngine.tags.push(new MarkdownNunjucksExtension());
  });
