import { Directive, forwardRef, ElementRef } from '@angular/core';
import { selectorGenerate, LazyLoadFormControlDirective } from 'cyia-ngx-common/lazy-load';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: selectorGenerate('lazy-load'),
  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => CustomLazyLoadFormControlDirective) }],
})
export class CustomLazyLoadFormControlDirective extends LazyLoadFormControlDirective {
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }
}
