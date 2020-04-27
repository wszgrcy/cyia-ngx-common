import { Processor } from 'dgeni';
import { AFTER_HANDLE } from '../const/run-time';
import { ServiceService } from './service.service';
import { SERVICE_TAG } from '../const/comment-tag';
export function ServiceProcessorFactory(serviceService) {
  return new ServiceProcessor(serviceService);
}
export class ServiceProcessor implements Processor {
  name = 'ServiceProcessor';
  $runBefore = [AFTER_HANDLE];
  $process(docs = []) {
    docs
      .filter((doc) => doc.tags && doc.tags.tags.find((item) => item.tagName === SERVICE_TAG))
      .forEach((item) => {
        this.serviceService.setService(item);
      });
    return docs;
  }
  constructor(private serviceService: ServiceService) {}
}
