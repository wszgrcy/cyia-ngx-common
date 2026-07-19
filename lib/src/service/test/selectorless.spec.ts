import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Injector,
  InjectionToken,
  provideZonelessChangeDetection,
  Component,
  signal,
  ComponentRef,
  RendererFactory2,
  Type,
  viewChild,
  inject,
  ElementRef,
  reflectComponentType,
} from '@angular/core';
import { DomRendererFactory2 } from '../dom_renderer';
import { excludeTag, resetTag } from '../exclude-component';
import { ProxyNode } from '../proxy-node';
async function createComponent<T>(Comp: Type<T>, tagList?: string[]) {
  resetTag();
  tagList?.forEach((item) => {
    excludeTag(item);
  });
  let tb: TestBed;
  let fixture: ComponentFixture<T>;
  let instance: T;
  let element: HTMLElement;
  tb = TestBed.configureTestingModule({
    imports: [Comp],
    providers: [{ provide: RendererFactory2, useClass: DomRendererFactory2 }],
  });
  fixture = TestBed.createComponent(Comp);

  fixture.detectChanges();
  element = fixture.nativeElement;
  instance = fixture.componentInstance;
  return { instance, element, fixture };
}
describe('selectorless', () => {
  beforeEach(async () => {});

  it('hello', async () => {
    @Component({
      template: `<div>hello</div>`,
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('hello');
  });
  it('comp', async () => {
    @Component({
      selector: 'test',
      template: `<div>hello</div>`,
    })
    class TestComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<test #ref></test>`,
      imports: [TestComp],
    })
    class TestParent {
      ref = viewChild.required<TestComp>('ref');
    }
    let { fixture, element, instance } = await createComponent(TestParent, [reflectComponentType(TestComp)!.selector]);
    expect(element.textContent).eq('hello');
    expect(instance.ref().el.nativeElement).instanceOf(ProxyNode);
  });
});
