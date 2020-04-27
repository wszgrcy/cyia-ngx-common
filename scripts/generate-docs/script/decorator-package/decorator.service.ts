import { HandleParameters } from '../util/handle-parameters';
import { DocDecorator } from '../define/function';
export function decoratorService(handleParameters) {
  return new DecoratorService(handleParameters);
}
export class DecoratorService {
  map = new Map<string, DocDecorator>();
  constructor(public handleParameters: HandleParameters) {}
  add(item) {
    const docDeccorator: DocDecorator = new DocDecorator();
    docDeccorator.id = item.id;
    docDeccorator.name = item.name;
    docDeccorator.description = item.description;
    docDeccorator.aliases = item.aliases;
    docDeccorator.docParameters = this.handleParameters.handle(item);
    this.map.set(item.name, docDeccorator);
  }
  getAll() {
    return [...this.map.values()];
  }
}
