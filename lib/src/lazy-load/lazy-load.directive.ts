import { LazyLoadService } from './lazy-load.service';
import { Directive, ViewContainerRef, Input, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';

/**
 * 懒加载结构型指令,传入定义的懒加载组件名(自定义)自动进行加载
 *
 * @author cyia
 * @date 2020-08-02
 * @export
 * @class LazyLoadDirective
 */
@Directive({
  selector: '[lazyLoad]',
  standalone: false,
})
export class LazyLoadDirective implements OnChanges {
  @Input() private lazyLoad: string;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private lazyLoadService: LazyLoadService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.lazyLoad && changes.lazyLoad) {
      this.lazyLoadService.load(this.lazyLoad).then(() => {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      });
    }
  }
}
