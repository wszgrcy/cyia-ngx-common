import { Package } from 'dgeni';
import { BasePackage } from '../base-package';
import { docsDataProcessor } from './docs-data.processor';
import { MODULE_TAG, SERVICE_TAG, DECORATOR_TAG } from '../const/comment-tag';
import { docsDataService } from './docs-data.service';

export const DocsDataPackage = new Package('docs-data-package', [BasePackage])
  .factory(docsDataService)
  .processor(docsDataProcessor)
  .config(function (parseTagsProcessor: any) {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([
      { name: MODULE_TAG },
      { name: SERVICE_TAG },
      { name: DECORATOR_TAG },
    ]);
  });
