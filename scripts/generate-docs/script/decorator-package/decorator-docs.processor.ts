import { Processor } from 'dgeni';
import { DocDecorator } from '../define/function';
import { HandleParameters } from '../util/handle-parameters';
import { DECORATOR_DOC_TYPE } from '../const/doc-type';
import { DECORATOR_TAG } from '../const/comment-tag';
import { DecoratorService } from './decorator.service';
export function DecoratorDocsProcessorFactory(decoratorService) {
  return new DecoratorDocsProcessor(decoratorService);
}
export class DecoratorDocsProcessor implements Processor {
  name = 'decoratorDocsProcessor';
  $runBefore = ['after-handle'];
  $process(docs = []) {
    docs
      .filter((item) => item.docType === 'function' && item.tags.tags.find((item) => item.tagName === DECORATOR_TAG))
      .forEach((item) => {
        this.decoratorService.add(item);
      });
    return docs;
  }
  constructor(public decoratorService: DecoratorService) {}
}
