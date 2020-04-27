import { Processor } from 'dgeni';
import { AFTER_HANDLE } from '../const/run-time';
import { SERVICE_TAG, MODULE_TAG } from '../const/comment-tag';
import { ModuleService } from './module.service';
export function ModuleProcessorFactory(moduleService) {
  return new ModuleProcessor(moduleService);
}
export class ModuleProcessor implements Processor {
  name = 'ModuleProcessor';
  $runBefore = [AFTER_HANDLE];
  $runAfter = ['ServiceProcessorFactory'];
  $process(docs = []) {
    console.log('模块处理');
    docs
      .filter((doc) => doc.tags.tags.find((item) => item.tagName === MODULE_TAG))
      .forEach((item) => {
        this.moduleService.add(item);
      });
  }
  constructor(private moduleService: ModuleService) {}
}
