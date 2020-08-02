import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';
export function selectorGenerate(str: string) {
  return `${str}[ngModel]:not([formControlName]):not(formControl),${str}[formControlName]:not([ngModel]):not(formControl),${str}[formControl]:not([ngModel]):not([formControlName])`;
}

export class LazyLoadFormControlBase implements ControlValueAccessor {
  private onChange: (arg) => void;
  private onTouched: (arg) => void;
  private instance: ControlValueAccessor;
  private writeValue$ = new Subject();
  private onChange$ = new Subject<(arg) => void>();
  private onTouched$ = new Subject<(arg) => void>();

  private value = [];
  constructor(private elementRef: ElementRef<HTMLElement>) {
    this.waitComponentLoaded().then((component) => {
      this.instance = component;
      this.onChange$.next(this.onChange);
      this.onTouched$.next(this.onTouched);
      this.value.forEach((e) => {
        this.writeValue$.next(e);
      });
    });
    this.writeValue$.subscribe((value) => {
      if (this.instance) {
        this.instance.writeValue(value);
      } else {
        this.value.push(value);
      }
    });
    this.onChange$.pipe(filter(Boolean)).subscribe((e: (arg) => void) => {
      if (this.instance) {
        this.instance.registerOnChange(e);
        this.onChange$.complete();
      } else {
        this.onChange = e;
      }
    });
    this.onTouched$.pipe(filter(Boolean)).subscribe((e: (arg) => void) => {
      if (this.instance) {
        this.instance.registerOnTouched(e);
        this.onTouched$.complete();
      } else {
        this.onTouched = e;
      }
    });
  }

  registerOnChange(fn): void {
    this.onChange$.next(fn);
  }
  registerOnTouched(fn): void {
    this.onTouched$.next(fn);
  }
  writeValue(value): void {
    this.writeValue$.next(value);
  }
  waitComponentLoaded(): Promise<ControlValueAccessor> {
    return fromEvent(this.elementRef.nativeElement, 'componentIsLoaded')
      .pipe(
        filter((e: any) => e.detail),
        map((e) => e.detail),
        take(1)
      )
      .toPromise();
  }
}
