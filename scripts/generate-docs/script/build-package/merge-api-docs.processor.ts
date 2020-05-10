import { DocsDataService } from '../docs-data-package/docs-data.service';
import { Processor } from 'dgeni';
import { MODULE_DOC_TYPE, API_DOC_TYPE } from '../const/doc-type';

export function mergeApiDocsProcess(docsDataService) {
  return new MergeApiDocsProcess(docsDataService);
}
export class MergeApiDocsProcess implements Processor {
  constructor(private docsDataService: DocsDataService) {}
  name = 'mergeApiDocsProcess';
  $runBefore = ['adding-extra-docs'];
  $process() {
    const services = this.docsDataService.getDocServices();
    const modules = this.docsDataService.getDocModules();
    const decorators = this.docsDataService.getDocDecorators();

    const apiDocs = modules.map((item) => {
      const obj: any = {
        services: [],
        decorators: [],
      };
      obj.services = services.filter((item) => item.importLib === item.importLib);
      obj.decorators = decorators.filter((item) => item.importLib === item.importLib);
      obj.folder = item.folder;
      obj.docType = API_DOC_TYPE;
      obj.templatename = 'api';
    //   obj.path = 'api';
      obj.name = item.name;
      return obj;
    });
    return modules.concat(apiDocs as any);
  }
  mergeApiDocs() {}
}
