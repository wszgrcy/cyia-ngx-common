import { Processor } from 'dgeni';
import { TypeService } from './type.service';
export function TypeProcessorFactory(typeService: TypeService) {
  return new TypeProcessor(typeService);
}
export class TypeProcessor implements Processor {
  name = 'typeProcessor';
  $runBefore = ['before-handle'];
  $process(docs = []) {
    const typeList = [];
    this.typeService.setType(docs);
  }
  constructor(private typeService: TypeService) {}
}
