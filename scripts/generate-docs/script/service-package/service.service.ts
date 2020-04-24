import { TypeService } from '../type-package/type.service';
import { DocService } from '../define/doc-service';
import { MethodMemberDoc } from 'dgeni-packages/typescript/api-doc-types/MethodMemberDoc';
import { DocMethod } from '../define/doc-method';
import { HandleParameters } from '../util/handle-parameters';
import { SERVICE_DOC_TYPE } from '../const/doc-type';
export function serviceService(typeService, handleParameters) {
  return new ServiceService(typeService, handleParameters);
}
export class ServiceService {
  serviceMap = new Map<string, DocService>();
  setService(item) {
    const docService: DocService = { ...item };
    docService.docType = SERVICE_DOC_TYPE;
    docService.name = item.name;
    docService.description = item.description;
    docService.methodList = item.members
      .filter((member) => member instanceof MethodMemberDoc)
      .map((member) => {
        const docMethod = new DocMethod();
        docMethod.name = member.name;
        docMethod.description = member.description;
        docMethod.docParameters = this.handleParameters.handle(member);
        docMethod.returnType = member.type;
        return docMethod;
      });
    this.serviceMap.set(item.name, docService);
  }
  getService() {}
  getAll() {
    return [...this.serviceMap.values()];
  }
  constructor(private typeService: TypeService, private handleParameters: HandleParameters) {}
}
