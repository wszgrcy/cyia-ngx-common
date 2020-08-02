import { LazyLoadService } from './lazy-load.service';
import { Directive, ViewContainerRef, Input, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
  selector: '[lazyLoad]',
})
export class LazyLoadDirective implements OnChanges {
  @Input() private lazyLoad;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private lazyLoadService: LazyLoadService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.lazyLoad && changes.lazyLoad) {
      this.lazyLoadService.load(this.lazyLoad).then(() => {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      });
    }
  }
}
