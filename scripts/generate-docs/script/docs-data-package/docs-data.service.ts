import { DocType } from '../define/doc-type';
import { DocService } from '../define/doc-service';
import { MethodMemberDoc } from 'dgeni-packages/typescript/api-doc-types/MethodMemberDoc';
import { DocMethod } from '../define/doc-method';
import { DocParameter } from '../define/parameter';
import { ParameterContainer } from 'dgeni-packages/typescript/api-doc-types/ParameterContainer';
import { FunctionExportDoc } from 'dgeni-packages/typescript/api-doc-types/FunctionExportDoc';
import { DocDecorator } from '../define/function';
import { DocModule } from '../define/doc-module';

export function docsDataService() {
  return new DocsDataService();
}
export class DocsDataService {
  constructor() {}
  private docTypeMap = new Map<string, DocType>();
  /**原始类型的文档列表 */
  private orgtypeDocList = [];

  docServiceMap = new Map<string, DocService>();
  docDecoratorMap = new Map<string, DocDecorator>();
  docModuleMap = new Map<string, DocModule>();
  setDocTypes(docs = []) {
    // todo 修改类型识别判断
    this.orgtypeDocList = docs.filter((item) => item.docType === 'class' || item.docType === 'interface');
    this.orgtypeDocList.forEach((doc: any, i) => {
      this.addDocType(doc);
    });
  }
  private addDocType(doc) {
    if (this.docTypeMap.has(doc.name)) {
      return;
    }
    const docType = new DocType();
    docType.name = doc.name;
    docType.description = doc.description;
    doc.members.forEach((member) => {
      // console.log(member.declaration.initializer.text);
      docType.propertyList.push({
        name: member.name,
        description: member.description,
        type: member.type,
        // default: member.declaration.initializer.text,
      });
      const extraType = this.findDocType(member.type);
      if (extraType) {
        docType.extraDocTypeList.push(extraType);
      }
    });
    this.docTypeMap.set(doc.name, docType);
  }
  private findDocType(type: string) {
    const returnType = this.docTypeMap.get(type);
    if (!returnType) {
      const orgDoc = this.orgtypeDocList.find((doc) => doc.name === type);
      if (orgDoc) {
        this.addDocType(orgDoc);
        return this.docTypeMap.get(type);
      } else {
        return undefined;
      }
    }
    return returnType;
  }
  getDocType(name: string) {
    return this.docTypeMap.get(name);
  }
  addDocService(item) {
    const docService: DocService = new DocService();
    docService.id = item.id;
    docService.aliases = item.aliases;
    docService.name = item.name;
    docService.description = item.description;
    docService.methodList = item.members
      .filter((member) => member instanceof MethodMemberDoc)
      .map((member) => {
        const docMethod = new DocMethod();
        docMethod.name = member.name;
        docMethod.description = member.description;
        docMethod.docParameters = this.handle(member);
        docMethod.returnType = member.type;
        return docMethod;
      });
    this.docServiceMap.set(item.name, docService);
  }
  /**处理方法,函数(装饰器)的参数 */
  handle(docs: FunctionExportDoc) {
    return docs.parameterDocs
      .map((item) => ({
        parameterDoc: item,
        parameter: docs.parameters.find(
          (parameter) =>
            parameter
              .replace(/^\.{3}/, '')
              .split(':')[0]
              .split('?')[0]
              .trim() === item.name
        ),
        /**注释 */
        param:
          docs['params'] && (docs['params'] as ParameterContainer['params']).find((param) => param.name === item.name),
      }))
      .map((item) => this.handleParameter(item));
  }
  private handleParameter({
    parameterDoc,
    parameter,
    param,
  }: {
    parameterDoc: ParameterContainer['parameterDocs'][0];
    parameter: ParameterContainer['parameters'][0];
    param?: ParameterContainer['params'][0];
  }) {
    const docParameter = new DocParameter(parameterDoc.name);
    docParameter.description = (param && param.description) || parameterDoc.description;
    docParameter.isRestParam = parameterDoc.isRestParam;
    docParameter.defaultValue = parameter.replace(/^.*\=/, '').trim();
    docParameter.isOptional = docParameter.isRestParam || parameterDoc.isOptional;
    docParameter.parameter = parameter;
    docParameter.type =
      parameter
        .replace(/^.*\:/, '')
        .replace(/\=.*$/, '')
        .replace(/\<.*\>$/, '')
        .trim() || '';
    docParameter.typeLink = this.getDocType(docParameter.type);
    return docParameter;
  }
  addDocDecorator(item) {
    const docDecorator: DocDecorator = new DocDecorator();
    docDecorator.id = item.id;
    docDecorator.name = item.name;
    docDecorator.description = item.description;
    docDecorator.aliases = item.aliases;
    docDecorator.docParameters = this.handle(item);
    this.docDecoratorMap.set(item.name, docDecorator);
  }

  addDocModule(item) {
    const docModule: DocModule = new DocModule();
    docModule.id = item.id;
    docModule.name = item.name;
    docModule.description = item.description;
    docModule.aliases = item.aliases;
    this.docModuleMap.set(item.name, docModule);
  }
  getDocServices() {
    return [...this.docServiceMap.values()];
  }
  getDocDecorators() {
    return [...this.docDecoratorMap.values()];
  }
  getDocModules() {
    return [...this.docModuleMap.values()];
  }
  getAll(): any[] {
    return [].concat(this.getDocDecorators(), this.getDocModules(), this.getDocServices());
  }
}
