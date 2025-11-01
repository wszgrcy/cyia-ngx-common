import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Injector,
  InjectionToken,
  provideZonelessChangeDetection,
  Component,
  signal,
  ComponentRef,
} from '@angular/core';
import { PurePipe } from '../pure.pipe';

describe('pure-pipe', () => {
  @Component({
    template: `<div class="pure-wrapper">{{ syncFn | pure : value$() }}</div>`,
    standalone: true,
    imports: [PurePipe],
  })
  class TestComp {
    value$ = signal(1);
    syncFn(value: any) {
      return value;
    }
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

  it('sync', () => {
    let el = element.querySelector('div.pure-wrapper');
    expect(el.innerHTML).toEqual('1');
    instance.value$.set(2);
    fixture.detectChanges();
    expect(el.innerHTML).toEqual('2');
  });
});
