import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Injector,
  InjectionToken,
  provideZonelessChangeDetection,
  Component,
  signal,
  ComponentRef,
  output,
  viewChild,
  input,
} from '@angular/core';
import { SelectorlessOutlet } from '../selectorless-outlet';
@Component({
  template: `
    <ng-template #templateRef>
      <div class="d-wrapper">{{ value() }}</div>
      <button class="output1" (click)="output1Emit($event)"></button>
    </ng-template>
  `,
  standalone: true,
  imports: [SelectorlessOutlet],
})
class DComp {
  templateRef = viewChild.required('templateRef');
  value = input(1);
  output1 = output();
  output1Emit(event: any) {
    this.output1.emit(event);
  }
}

describe('selectorless', () => {
  @Component({
    template: `<ng-template
      [selectlessOutlet]="DComp"
      [selectlessOutletInputs]="{ value: value$ }"
      [selectlessOutletOutputs]="{ output1: output1Emit }"
    ></ng-template> `,
    standalone: true,
    imports: [SelectorlessOutlet],
  })
  class TestComp {
    DComp = DComp;
    value$ = signal(1);
    outputValue = signal(undefined);
    output1Emit = (event: any) => {
      this.outputValue.set(event);
    };
  }
  let tb: TestBed;
  let fixture: ComponentFixture<TestComp>;
  let instance: TestComp;
  let element: HTMLElement;

  beforeEach(async () => {
    tb = TestBed.configureTestingModule({
      imports: [TestComp],
      providers: [provideZonelessChangeDetection()],
    });
    await tb.compileComponents();
    fixture = TestBed.createComponent(TestComp);
    fixture.detectChanges();
    element = fixture.nativeElement;
    instance = fixture.componentInstance;
  });

  it('hello', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    let el = element.querySelector('div.d-wrapper');
    expect(el).toBeTruthy();
    expect(el.innerHTML).toEqual('1');
    instance.value$.set(2);
    fixture.detectChanges();
    expect(el.innerHTML).toEqual('2');
    let buttonEl = element.querySelector('.output1') as HTMLButtonElement;
    buttonEl.click();
    expect(instance.outputValue()).toBeTruthy();
  });
});
