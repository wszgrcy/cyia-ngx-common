import { Processor, DocCollection } from 'dgeni';
import { DECORATOR_DOC_TYPE, SERVICE_DOC_TYPE, MODULE_DOC_TYPE } from '../const/doc-type';
import { ServiceService } from '../service-package/service.service';
import { DecoratorService } from '../decorator-package/decorator.service';
import { moduleService, ModuleService } from '../module-package/module.service';
const ALLOW_OUT_DOCS = [DECORATOR_DOC_TYPE, SERVICE_DOC_TYPE, MODULE_DOC_TYPE];

export function ExportSpecifiedDocsProcessorFactory(serviceService, decoratorService, moduleService) {
  return new ExportSpecifiedDocsProcessor(serviceService, decoratorService, moduleService);
}
/**导出指定的文档 */
export class ExportSpecifiedDocsProcessor implements Processor {
  name = 'exportSpecifiedDocsProcessor';
  $runBefore = ['adding-extra-docs'];
  $process(docs: DocCollection) {
    // todo 可以取相应服务的文档
    return [].concat(this.serviceService.getAll()).concat(this.decoratorService.getAll()).concat(this.moduleService.getAll());
    // .concat(this.serviceService.getAll());
  }
  constructor(
    private serviceService: ServiceService,
    private decoratorService: DecoratorService,
    private moduleService: ModuleService
  ) {}
}
