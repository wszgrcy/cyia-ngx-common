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
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { DomRendererFactory2 } from '../dom_renderer';
import { selectorlessExcludeTag, selectorlessResetTag } from '../exclude-component';
import { ProxyNode } from '../proxy-node';
import { NgTemplateOutlet } from '@angular/common';
async function createComponent<T>(Comp: Type<T>, tagList?: string[]) {
  selectorlessResetTag();
  tagList?.forEach((item) => {
    selectorlessExcludeTag(item);
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
  it('if-hello', async () => {
    @Component({
      template: `@if(open()){
        <div>hello</div>
        }`,
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('hello');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('hello');
  });
  it('if-else', async () => {
    @Component({
      template: `@if(open()){
        <div>hello</div>
        }@else{
        <span>world</span>
        }`,
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('hello');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('world');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('hello');
  });
  it('if-else-component', async () => {
    @Component({
      selector: 'hello',
      template: `<div>hello</div>`,
    })
    class Hello {
      el = inject(ElementRef);
    }
    @Component({
      selector: 'world',
      template: `<span>world</span>`,
    })
    class World {
      el = inject(ElementRef);
    }
    @Component({
      template: `@if(open()){
        <hello></hello>
        }@else{
        <world></world>
        }`,
      imports: [Hello, World],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(Hello)!.selector,
      reflectComponentType(World)!.selector,
    ]);
    expect(element.textContent).eq('hello');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('world');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('hello');
  });
  it('if-else-component-text', async () => {
    @Component({
      selector: 'hello',
      template: `<div>hello</div>`,
    })
    class Hello {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(open()){
        <hello></hello>
        }@else{
        <span>world</span>
        }`,
      imports: [Hello],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Hello)!.selector]);
    expect(element.textContent).eq('hello');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('world');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('hello');
  });
  it('if-else-text-component', async () => {
    @Component({
      selector: 'world',
      template: `<div>world</div>`,
    })
    class World {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(open()){
        <div>hello</div>
        }@else{
        <world></world>
        }`,
      imports: [World],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(World)!.selector]);
    expect(element.textContent).eq('hello');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('world');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('hello');
  });
  it('ng-template', async () => {
    @Component({
      template: `
        <ng-template #hello>hello</ng-template>

        <ng-container *ngTemplateOutlet="hello"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('hello');
  });
  it('if-ng-template', async () => {
    @Component({
      template: ` <ng-template #hello>hello</ng-template>
        <ng-template #world>world</ng-template>

        @if(open()){
        <ng-container *ngTemplateOutlet="hello"></ng-container>

        }@else{
        <ng-container *ngTemplateOutlet="world"></ng-container>
        }`,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('hello');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('world');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('hello');
  });
  it('list', async () => {
    @Component({
      template: `@for(item of list();track $index){
        <span>{{ item }}</span>
        }`,
      imports: [],
    })
    class TestComp {
      list = signal(['1', '2']);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('12');
    instance.list.set([]);
    fixture.detectChanges();
    expect(element.textContent).eq('');
    instance.list.set(['1', '2', '3']);
    fixture.detectChanges();
    expect(element.textContent).eq('123');
  });

  it('ng-content', async () => {
    @Component({
      selector: 'hello',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Hello {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(open()){
        <hello>hello</hello>
        }@else{
        <hello>world</hello>
        }`,
      imports: [Hello],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Hello)!.selector]);
    expect(element.textContent).eq('hello');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('world');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('hello');
  });
  it('ViewContainerRef', async () => {
    @Component({
      template: `<ng-template #ref><span>world</span></ng-template> <span #vc>hello</span>`,
    })
    class TestComp {
      vc = viewChild.required('vc', { read: ViewContainerRef });
      ref = viewChild.required<TemplateRef<any>>('ref');
      ngOnInit(): void {
        this.vc().createEmbeddedView(this.ref());
      }
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('helloworld');
  });
  it('tag-component-tag', async () => {
    @Component({
      selector: 'hello',
      template: `<span>hello</span>`,
    })
    class Hello {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>first</span><hello></hello><span>last</span>`,
      imports: [Hello],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Hello)!.selector]);
    expect(element.textContent).eq('firsthellolast');
  });
  it('component-tag-component', async () => {
    @Component({
      selector: 'hello',
      template: `<span>hello</span>`,
    })
    class Hello {
      el = inject(ElementRef);
    }

    @Component({
      template: `<hello></hello><span>first</span><hello></hello>`,
      imports: [Hello],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Hello)!.selector]);
    expect(element.textContent).eq('hellofirsthello');
  });
  it('component-ng-content-component', async () => {
    @Component({
      selector: 'child',
      template: `<span><ng-content></ng-content> </span>`,
    })
    class Child {
      el = inject(ElementRef);
    }

    @Component({
      template: `<child><child>hello</child></child>`,
      imports: [Child],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Child)!.selector]);
    expect(element.textContent).eq('hello');
  });
  it('component-switch', async () => {
    @Component({
      selector: 'child',
      template: `<span>first</span><span><ng-content></ng-content></span><span>last</span>`,
    })
    class Child {
      el = inject(ElementRef);
    }

    @Component({
      template: `<child>@if(open()){hello}@else{world}</child>`,
      imports: [Child],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Child)!.selector]);
    expect(element.textContent).eq('firsthellolast');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('firstworldlast');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('firsthellolast');
  });
  it('component-ng-content-dynamic', async () => {
    @Component({
      selector: 'child',
      template: `<span>first</span
        ><span>
          @if(1){
          <ng-content></ng-content>
          } </span
        ><span>last</span>`,
    })
    class Child {
      el = inject(ElementRef);
    }

    @Component({
      template: `<child>@if(open()){hello}@else{world}</child>`,
      imports: [Child],
    })
    class TestComp {
      open = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Child)!.selector]);
    expect(element.textContent).eq('firsthellolast');
    instance.open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('firstworldlast');
    instance.open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('firsthellolast');
  });
  it('component-ng-content-dynamic2', async () => {
    @Component({
      selector: 'child',
      template: `<span>first</span
        ><span>
          @if(open()){
          <ng-content></ng-content>
          } </span
        ><span>last</span>`,
    })
    class Child {
      open = signal(true);
      constructor() {
        expect(inject(ElementRef).nativeElement).instanceOf(ProxyNode);
      }
    }

    @Component({
      template: `<child #child><span>hello</span></child>`,
      imports: [Child],
    })
    class TestComp {
      child = viewChild.required<Child>('child');
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Child)!.selector]);
    expect(element.textContent).eq('firsthellolast');
    instance.child().open.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('firstlast');
    instance.child().open.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('firsthellolast');
  });
});
