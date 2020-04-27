import { FunctionExportDoc } from 'dgeni-packages/typescript/api-doc-types/FunctionExportDoc';
import { DocParameter } from '../define/parameter';
import { ParameterContainer } from 'dgeni-packages/typescript/api-doc-types/ParameterContainer';
import { TypeService } from '../type-package/type.service';
export function handleParameters(typeService) {
  return new HandleParameters(typeService);
}
/**处理函数,方法,装饰器等参数
 *
 */
export class HandleParameters {
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
    docParameter.typeLink = this.typeService.getType(docParameter.type);
    return docParameter;
  }
  constructor(private typeService: TypeService) {}
}
