import { Processor } from 'dgeni';
import { DocDecorator } from '../define/function';
import { HandleParameters } from '../util/handle-parameters';
import { DECORATOR_DOC_TYPE } from '../const/doc-type';
import { DECORATOR_TAG } from '../const/comment-tag';
export function DecoratorDocsProcessorFactory(handleParameters) {
  return new DecoratorDocsProcessor(handleParameters);
}
export class DecoratorDocsProcessor implements Processor {
  name = 'decoratorDocsProcessor';
  $runBefore = ['after-handle'];
  $process(docs = []) {
    /**装饰器列表 */
    const decoratorList = [];
    docs.forEach((item) => {
      if (item.docType === 'function' && item.tags.tags.find((item) => item.tagName === DECORATOR_TAG)) {
        const docDeccorator: DocDecorator = { ...item };
        docDeccorator.docParameters = this.handleParameters.handle(item);
        docDeccorator.docType = DECORATOR_DOC_TYPE;

        decoratorList.push(docDeccorator);
      }
    });
    return docs.concat(decoratorList);
  }
  constructor(public handleParameters: HandleParameters) {}
}
