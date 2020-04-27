import { HandleParameters } from '../util/handle-parameters';
import { DocModule } from '../define/doc-module';
export function moduleService(handleParameters) {
  return new ModuleService(handleParameters);
}
export class ModuleService {
  map = new Map<string, DocModule>();
  constructor(public handleParameters: HandleParameters) {}
  add(item) {
    const docDeccorator: DocModule = new DocModule();
    docDeccorator.id = item.id;
    docDeccorator.name = item.name;
    docDeccorator.description = item.description;
    docDeccorator.aliases = item.aliases;
    this.map.set(item.name, docDeccorator);
  }
  getAll() {
    return [...this.map.values()];
  }
}
