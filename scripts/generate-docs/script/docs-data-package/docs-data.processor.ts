import { DocsDataService } from './docs-data.service';
import { Processor } from 'dgeni';
import { HANDING_DOCS_DATA } from '../const/run-time';
import { MODULE_TAG, DECORATOR_TAG, SERVICE_TAG } from '../const/comment-tag';

export function docsDataProcessor(docsDataService) {
  return new DocsDataProcessor(docsDataService);
}
class DocsDataProcessor implements Processor {
  name = 'docsDataProcessor';
  $runBefore = [HANDING_DOCS_DATA];
  constructor(private docsDataService: DocsDataService) {}
  $process(docs: any) {
    this.docsDataService.setDocTypes(docs);
    for (const doc of docs) {
      const tags: any[] = doc.tags.tags;
      if (tags.find((tag) => tag.tagName === MODULE_TAG)) {
        this.docsDataService.addDocModule(doc);
      } else if (tags.find((tag) => tag.tagName === DECORATOR_TAG)) {
        this.docsDataService.addDocDecorator(doc);
      } else if (tags.find((tag) => tag.tagName === SERVICE_TAG)) {
        this.docsDataService.addDocService(doc);
      }
    }
  }
}
