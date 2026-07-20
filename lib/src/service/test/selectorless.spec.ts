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
import { NgTemplateOutlet, NgComponentOutlet } from '@angular/common';
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

  // ==================== 基础元素插入测试 ====================

  it('tag-single', async () => {
    @Component({
      template: `<div>single</div>`,
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('single');
  });

  it('tag-multiple-siblings', async () => {
    @Component({
      template: `<span>1</span><span>2</span><span>3</span>`,
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('123');
  });

  it('tag-nested', async () => {
    @Component({
      template: `<div>
        <span><em>nested</em></span>
      </div>`,
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('nested');
  });

  // ==================== 组件直接插入测试 ====================

  it('component-single', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp-content`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp>`,
      imports: [MyComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('comp-content');
  });

  it('component-multiple-siblings', async () => {
    @Component({
      selector: 'first',
      template: `first`,
    })
    class First {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'second',
      template: `second`,
    })
    class Second {
      el = inject(ElementRef);
    }

    @Component({
      template: `<first></first><second></second><first></first>`,
      imports: [First, Second],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(First)!.selector,
      reflectComponentType(Second)!.selector,
    ]);
    expect(element.textContent).eq('firstsecondfirst');
  });

  it('component-with-content-text', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `<wrapper>Hello Content</wrapper>`,
      imports: [Wrapper],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('Hello Content');
  });

  it('component-with-content-element', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `<wrapper><span>nested content</span></wrapper>`,
      imports: [Wrapper],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('nested content');
  });

  it('component-with-content-multiple', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `<wrapper><span>1</span><span>2</span><span>3</span></wrapper>`,
      imports: [Wrapper],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('123');
  });

  it('component-nested', async () => {
    @Component({
      selector: 'inner',
      template: `inner`,
    })
    class Inner {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'outer',
      template: `outer<inner></inner>`,
      imports: [Inner],
    })
    class Outer {
      el = inject(ElementRef);
    }

    @Component({
      template: `<outer></outer>`,
      imports: [Outer],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(Outer)!.selector,
      reflectComponentType(Inner)!.selector,
    ]);
    expect(element.textContent).eq('outerinner');
  });

  // ==================== 模板动态插入测试 ====================

  it('template-outlet-single', async () => {
    @Component({
      template: `
        <ng-template #t>Hello Template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('Hello Template');
  });

  it('template-outlet-multiple', async () => {
    @Component({
      template: `
        <ng-template #a>A</ng-template>
        <ng-template #b>B</ng-template>
        <ng-template #c>C</ng-template>
        <ng-container *ngTemplateOutlet="a"></ng-container>
        <ng-container *ngTemplateOutlet="b"></ng-container>
        <ng-container *ngTemplateOutlet="c"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('ABC');
  });

  it('template-outlet-with-variables', async () => {
    @Component({
      template: `
        <ng-template #t let-name let-age="age">Name: {{ name }}, Age: {{ age }}</ng-template>
        <ng-container *ngTemplateOutlet="t; context: { $implicit: 'John', age: 30 }"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('Name: John, Age: 30');
  });

  // ==================== 组件动态插入测试(ngComponentOutlet) ====================

  it('component-outlet-single', async () => {
    @Component({
      selector: 'dynamic-comp',
      template: `dynamic`,
    })
    class DynamicComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="compType"></ng-container>`,
      imports: [DynamicComp, NgComponentOutlet],
    })
    class TestComp {
      compType = DynamicComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynamicComp)!.selector]);
    expect(element.textContent).eq('dynamic');
  });

  it('component-outlet-dynamic-type', async () => {
    @Component({
      selector: 'comp-a',
      template: `A`,
    })
    class CompA {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'comp-b',
      template: `B`,
    })
    class CompB {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="compType()"></ng-container>`,
      imports: [CompA, CompB, NgComponentOutlet],
    })
    class TestComp {
      compType = signal<Type<any>>(CompA);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(CompA)!.selector,
      reflectComponentType(CompB)!.selector,
    ]);
    expect(element.textContent).eq('A');
    instance.compType.set(CompB);
    fixture.detectChanges();
    expect(element.textContent).eq('B');
  });

  it('component-outlet-with-inputs', async () => {
    @Component({
      selector: 'input-comp',
      template: `value: {{ value }}`,
      inputs: ['value'],
    })
    class InputComp {
      el = inject(ElementRef);
      value = '';
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="compType; inputs: compInputs"></ng-container>`,
      imports: [InputComp, NgComponentOutlet],
    })
    class TestComp {
      compType = InputComp;
      compInputs = { value: 'test' };
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(InputComp)!.selector]);
    expect(element.textContent).eq('value: test');
  });

  // ==================== @if条件控制测试 ====================

  it('if-single-element', async () => {
    @Component({
      template: `@if(show()){
        <div>shown</div>
        }`,
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('shown');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('if-multiple-elements', async () => {
    @Component({
      template: `@if(show()){ <span>a</span><span>b</span><span>c</span> }`,
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('abc');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('if-component', async () => {
    @Component({
      selector: 'visible',
      template: `visible`,
    })
    class Visible {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){ <visible></visible> }`,
      imports: [Visible],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Visible)!.selector]);
    expect(element.textContent).eq('visible');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('if-template-outlet', async () => {
    @Component({
      template: `
        <ng-template #t>template content</ng-template>
        @if(show()){ <ng-container *ngTemplateOutlet="t"></ng-container> }
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('template content');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('if-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){ <ng-container *ngComponentOutlet="DynComp"></ng-container> }`,
      imports: [DynComp, NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamic');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('if-text-content', async () => {
    @Component({
      template: `@if(show()){text content}`,
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('text content');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('if-nested', async () => {
    @Component({
      template: `@if (a()) { @if (b()) {nested}}`,
    })
    class TestComp {
      a = signal(true);
      b = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('nested');
    instance.a.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  // ==================== @for循环控制测试 ====================

  it('for-basic', async () => {
    @Component({
      template: `@for(item of items(); track item){{{ item }}}`,
    })
    class TestComp {
      items = signal(['a', 'b', 'c']);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('abc');
    instance.items.set(['x', 'y']);
    fixture.detectChanges();
    expect(element.textContent).eq('xy');
  });

  it('for-with-element', async () => {
    @Component({
      template: `@for(item of items(); track item){ <span>{{ item }}</span> }`,
    })
    class TestComp {
      items = signal(['1', '2']);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('12');
    instance.items.set(['3']);
    fixture.detectChanges();
    expect(element.textContent).eq('3');
  });

  it('for-with-component', async () => {
    @Component({
      selector: 'list-item',
      template: `item-{{ id }}`,
      inputs: ['id'],
    })
    class ListItem {
      el = inject(ElementRef);
      id = '';
    }

    @Component({
      template: `@for(item of items(); track item.id){ <list-item [id]="item.id"></list-item> }`,
      imports: [ListItem],
    })
    class TestComp {
      items = signal([{ id: 'a' }, { id: 'b' }]);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(ListItem)!.selector]);
    expect(element.textContent).eq('item-aitem-b');
  });

  it('for-empty', async () => {
    @Component({
      template: `@for(item of items(); track item){{{ item }}}@empty{empty}`,
    })
    class TestComp {
      items = signal<string[]>([]);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('empty');
    instance.items.set(['a']);
    fixture.detectChanges();
    expect(element.textContent).eq('a');
  });

  it('for-index', async () => {
    @Component({
      template: `@for (item of items(); track item; let i = $index) {{{ i }}:{{ item }}}`,
    })
    class TestComp {
      items = signal(['x', 'y']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('0:x1:y');
  });

  // ==================== @switch条件控制测试 ====================

  it('switch-basic', async () => {
    @Component({
      template: `@switch(state()){ @case('a'){case-a} @case('b'){case-b} @default(){default} }`,
    })
    class TestComp {
      state = signal('a');
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('case-a');
    instance.state.set('b');
    fixture.detectChanges();
    expect(element.textContent).eq('case-b');
    instance.state.set('c');
    fixture.detectChanges();
    expect(element.textContent).eq('default');
  });

  it('switch-multiple-cases', async () => {
    @Component({
      template: `@switch(state()){ @case('x'){x-case} @case('y'){y-case} @case('z'){z-case} }`,
    })
    class TestComp {
      state = signal('x');
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('x-case');
    instance.state.set('y');
    fixture.detectChanges();
    expect(element.textContent).eq('y-case');
  });

  it('switch-with-element', async () => {
    @Component({
      template: `@switch(state()){ @case(1){ <span>one</span> } @case(2){ <span>two</span> } }`,
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('one');
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('two');
  });

  it('switch-with-component', async () => {
    @Component({
      selector: 'panel-a',
      template: `panel-a`,
    })
    class PanelA {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'panel-b',
      template: `panel-b`,
    })
    class PanelB {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case('a'){ <panel-a></panel-a> } @case('b'){ <panel-b></panel-b> } }`,
      imports: [PanelA, PanelB],
    })
    class TestComp {
      state = signal('a');
    }
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(PanelA)!.selector,
      reflectComponentType(PanelB)!.selector,
    ]);
    expect(element.textContent).eq('panel-a');
    instance.state.set('b');
    fixture.detectChanges();
    expect(element.textContent).eq('panel-b');
  });

  // ==================== 分组排列组合测试 - 2个一组 ====================

  // 元素 + 元素
  it('group-2-tag-tag', async () => {
    @Component({
      template: `<span>first</span><span>second</span>`,
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('firstsecond');
  });

  // 元素 + 组件直接
  it('group-2-tag-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>first</span><my-comp></my-comp>`,
      imports: [MyComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('firstcomp');
  });

  // 元素 + 模板动态
  it('group-2-tag-template', async () => {
    @Component({
      template: `
        <ng-template #t>template</ng-template>
        <span>first</span>
        <ng-container *ngTemplateOutlet="t"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('firsttemplate');
  });

  // 元素 + 组件动态
  it('group-2-tag-component-outlet', async () => {
    @Component({
      selector: 'dyn',
      template: `dynamic`,
    })
    class Dyn {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>first</span><ng-container *ngComponentOutlet="Dyn"></ng-container>`,
      imports: [Dyn, NgComponentOutlet],
    })
    class TestComp {
      Dyn = Dyn;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(Dyn)!.selector]);
    expect(element.textContent).eq('firstdynamic');
  });

  // 元素 + @if条件
  it('group-2-tag-if', async () => {
    @Component({
      template: `<span>before</span>@if(show()){ <span>after</span> }`,
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('beforeafter');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('before');
  });

  // 元素 + @for循环
  it('group-2-tag-for', async () => {
    @Component({
      template: `<span>before</span>@for(item of items(); track item){{{ item }}}`,
    })
    class TestComp {
      items = signal(['a', 'b']);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('beforeab');
    instance.items.set(['c']);
    fixture.detectChanges();
    expect(element.textContent).eq('beforec');
  });

  // 元素 + @switch
  it('group-2-tag-switch', async () => {
    @Component({
      template: `<span>before</span>@switch(state()){ @case(1){ <span>one</span> } }`,
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('beforeone');
  });

  // 组件直接 + 组件直接
  it('group-2-component-component', async () => {
    @Component({
      selector: 'a-comp',
      template: `A`,
    })
    class AComp {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'b-comp',
      template: `B`,
    })
    class BComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<a-comp></a-comp><b-comp></b-comp>`,
      imports: [AComp, BComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(AComp)!.selector,
      reflectComponentType(BComp)!.selector,
    ]);
    expect(element.textContent).eq('AB');
  });

  // 组件直接 + 模板动态
  it('group-2-component-template', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp><ng-template #t>template</ng-template
        ><ng-container *ngTemplateOutlet="t"></ng-container>`,
      imports: [MyComp, NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('comptemplate');
  });

  // 组件直接 + 组件动态
  it('group-2-component-component-outlet', async () => {
    @Component({
      selector: 'static-comp',
      template: `static`,
    })
    class StaticComp {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<static-comp></static-comp><ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [StaticComp, DynComp, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(StaticComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('staticdynamic');
  });

  // 组件直接 + @if条件
  it('group-2-component-if', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp>@if(show()){ <span>after</span> }`,
      imports: [MyComp],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compafter');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('comp');
  });

  // 组件直接 + @for循环
  it('group-2-component-for', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp>@for(item of items(); track item){{{ item }}}`,
      imports: [MyComp],
    })
    class TestComp {
      items = signal(['a']);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compa');
  });

  // 组件直接 + @switch
  it('group-2-component-switch', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp>@switch(state()){ @case(1){ <span>one</span> } }`,
      imports: [MyComp],
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compone');
  });

  // 模板动态 + 模板动态
  it('group-2-template-template', async () => {
    @Component({
      template: `
        <ng-template #a>A</ng-template>
        <ng-template #b>B</ng-template>
        <ng-container *ngTemplateOutlet="a"></ng-container>
        <ng-container *ngTemplateOutlet="b"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('AB');
  });

  // 模板动态 + 组件动态
  it('group-2-template-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
      `,
      imports: [NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('templatedynamic');
  });

  // 模板动态 + @if条件
  it('group-2-template-if', async () => {
    @Component({
      template: `
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        @if(show()){ <span>after</span> }
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('templateafter');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('template');
  });

  // 模板动态 + @for循环
  it('group-2-template-for', async () => {
    @Component({
      template: `
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        @for(item of items(); track item){{{ item }}}
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('templatex');
  });

  // 模板动态 + @switch
  it('group-2-template-switch', async () => {
    @Component({
      template: `
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        @switch(state()){ @case(1){ <span>one</span> } }
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('templateone');
  });

  // 组件动态 + 组件动态
  it('group-2-component-outlet-component-outlet', async () => {
    @Component({
      selector: 'comp-a',
      template: `A`,
    })
    class CompA {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'comp-b',
      template: `B`,
    })
    class CompB {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="CompA"></ng-container
        ><ng-container *ngComponentOutlet="CompB"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      CompA = CompA;
      CompB = CompB;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(CompA)!.selector,
      reflectComponentType(CompB)!.selector,
    ]);
    expect(element.textContent).eq('AB');
  });

  // 组件动态 + @if条件
  it('group-2-component-outlet-if', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@if(show()){ <span>after</span> }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicafter');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamic');
  });

  // 组件动态 + @for循环
  it('group-2-component-outlet-for', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@for(item of items(); track item){{{ item
        }}}`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicx');
  });

  // 组件动态 + @switch
  it('group-2-component-outlet-switch', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@switch(state()){ @case(1){
        <span>one</span> } }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicone');
  });

  // @if条件 + @if条件
  it('group-2-if-if', async () => {
    @Component({
      template: `@if(a()){A}@if(b()){B}`,
    })
    class TestComp {
      a = signal(true);
      b = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('AB');
    instance.a.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('B');
  });

  // @if条件 + @for循环
  it('group-2-if-for', async () => {
    @Component({
      template: ` @if(show_a()){A}@for(item of items(); track item){{{ item }}}`,
    })
    class TestComp {
      show_a = signal(true);
      items = signal(['x']);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('Ax');
  });

  // @if条件 + @switch
  it('group-2-if-switch', async () => {
    @Component({
      template: ` @if(show_a()){A}@switch(state()){ @case(1){ <span>one</span> } }`,
    })
    class TestComp {
      show_a = signal(true);
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('Aone');
  });

  // @for循环 + @for循环
  it('group-2-for-for', async () => {
    @Component({
      template: `@for(item of items1(); track item){{{ item }}}@for(item of items2(); track item){{{ item }}}`,
    })
    class TestComp {
      items1 = signal(['a']);
      items2 = signal(['b']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('ab');
  });

  // @for循环 + @switch
  it('group-2-for-switch', async () => {
    @Component({
      template: `@for(item of items(); track item){{{ item }}}@switch(state()){ @case(1){ <span>one</span> } }`,
    })
    class TestComp {
      items = signal(['x']);
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('xone');
  });

  // @switch + @switch
  it('group-2-switch-switch', async () => {
    @Component({
      template: `@switch(s1()){ @case(1){A} }@switch(s2()){ @case(2){B} }`,
    })
    class TestComp {
      s1 = signal(1);
      s2 = signal(2);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('AB');
  });

  // ==================== 分组排列组合测试 - 3个一组 ====================

  // 元素 + 组件直接 + 元素
  it('group-3-tag-component-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>first</span><my-comp></my-comp><span>last</span>`,
      imports: [MyComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('firstcomplast');
  });

  // 组件直接 + 元素 + 组件直接
  it('group-3-component-tag-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp><span>middle</span><my-comp></my-comp>`,
      imports: [MyComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compmiddlecomp');
  });

  // 元素 + 元素 + 组件直接
  it('group-3-tag-tag-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>a</span><span>b</span><my-comp></my-comp>`,
      imports: [MyComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('abcomp');
  });

  // 组件直接 + 元素 + 元素
  it('group-3-component-tag-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp><span>a</span><span>b</span>`,
      imports: [MyComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compab');
  });

  // 元素 + 模板动态 + 元素
  it('group-3-tag-template-tag', async () => {
    @Component({
      template: `
        <ng-template #t>template</ng-template>
        <span>first</span>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <span>last</span>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('firsttemplatelast');
  });

  // 元素 + 组件动态 + 元素
  it('group-3-tag-component-outlet-tag', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>first</span><ng-container *ngComponentOutlet="DynComp"></ng-container><span>last</span>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('firstdynamiclast');
  });

  // 元素 + @if条件 + 元素
  it('group-3-tag-if-tag', async () => {
    @Component({
      template: `<span>before</span>@if(show()){ <span>middle</span> }<span>after</span>`,
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('beforemiddleafter');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('beforeafter');
  });

  // 元素 + @for循环 + 元素
  it('group-3-tag-for-tag', async () => {
    @Component({
      template: `<span>before</span>@for(item of items(); track item){{{ item }}}<span>after</span>`,
    })
    class TestComp {
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('beforexafter');
  });

  // 元素 + @switch + 元素
  it('group-3-tag-switch-tag', async () => {
    @Component({
      template: `<span>before</span>@switch(state()){ @case(1){ <span>middle</span> } }<span>after</span>`,
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('beforemiddleafter');
  });

  // 组件直接 + 模板动态 + 组件直接
  it('group-3-component-template-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp><ng-template #t>template</ng-template
        ><ng-container *ngTemplateOutlet="t"></ng-container><my-comp></my-comp>`,
      imports: [MyComp, NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('comptemplatecomp');
  });

  // 组件直接 + 组件动态 + 组件直接
  it('group-3-component-component-outlet-component', async () => {
    @Component({
      selector: 'static-comp',
      template: `static`,
    })
    class StaticComp {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<static-comp></static-comp><ng-container *ngComponentOutlet="DynComp"></ng-container
        ><static-comp></static-comp>`,
      imports: [StaticComp, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(StaticComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('staticdynamicstatic');
  });

  // 模板动态 + 元素 + 模板动态
  it('group-3-template-tag-template', async () => {
    @Component({
      template: `
        <ng-template #a>A</ng-template>
        <ng-container *ngTemplateOutlet="a"></ng-container>
        <span>MIDDLE</span>
        <ng-template #b>B</ng-template>
        <ng-container *ngTemplateOutlet="b"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('AMIDDLEB');
  });

  // 模板动态 + @if条件 + 模板动态
  it('group-3-template-if-template', async () => {
    @Component({
      template: `
        <ng-template #a>A</ng-template>
        <ng-container *ngTemplateOutlet="a"></ng-container>
        @if(show()){ <span>MIDDLE</span> }
        <ng-template #b>B</ng-template>
        <ng-container *ngTemplateOutlet="b"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('AMIDDLEB');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('AB');
  });

  // 组件动态 + 元素 + 组件动态
  it('group-3-component-outlet-tag-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container><span>MIDDLE</span
        ><ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicMIDDLEdynamic');
  });

  // @if条件 + 元素 + @if条件
  it('group-3-if-tag-if', async () => {
    @Component({
      template: `@if(a()){A}<span>MIDDLE</span>@if(b()){B}`,
    })
    class TestComp {
      a = signal(true);
      b = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('AMIDDLEB');
    instance.a.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('MIDDLEB');
  });

  // @for循环 + 元素 + @for循环
  it('group-3-for-tag-for', async () => {
    @Component({
      template: `@for(item of items1(); track item){{{ item }}}<span>MIDDLE</span>@for(item of items2(); track item){{{ item
        }}}`,
    })
    class TestComp {
      items1 = signal(['a']);
      items2 = signal(['b']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('aMIDDLEb');
  });

  // @switch + 元素 + @switch
  it('group-3-switch-tag-switch', async () => {
    @Component({
      template: `@switch(s1()){ @case(1){A} }<span>MIDDLE</span>@switch(s2()){ @case(2){B} }`,
    })
    class TestComp {
      s1 = signal(1);
      s2 = signal(2);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('AMIDDLEB');
  });

  // 元素 + 组件直接 + 模板动态
  it('group-3-tag-component-template', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>first</span><my-comp></my-comp><ng-template #t>template</ng-template
        ><ng-container *ngTemplateOutlet="t"></ng-container>`,
      imports: [MyComp, NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('firstcomptemplate');
  });

  // 组件直接 + 元素 + 模板动态
  it('group-3-component-tag-template', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp><span>MIDDLE</span><ng-template #t>template</ng-template
        ><ng-container *ngTemplateOutlet="t"></ng-container>`,
      imports: [MyComp, NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compMIDDLEtemplate');
  });

  // 模板动态 + 组件直接 + 元素
  it('group-3-template-component-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-template #t>template</ng-template><ng-container *ngTemplateOutlet="t"></ng-container
        ><my-comp></my-comp><span>last</span>`,
      imports: [MyComp, NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('templatecomplast');
  });

  // @if条件 + 组件直接 + 元素
  it('group-3-if-component-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){ <span>first</span> }<my-comp></my-comp><span>last</span>`,
      imports: [MyComp],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('firstcomplast');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('complast');
  });

  // @for循环 + 组件直接 + 元素
  it('group-3-for-component-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){{{ item }}}<my-comp></my-comp><span>last</span>`,
      imports: [MyComp],
    })
    class TestComp {
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('xcomplast');
  });

  // @switch + 组件直接 + 元素
  it('group-3-switch-component-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){ <span>first</span> } }<my-comp></my-comp><span>last</span>`,
      imports: [MyComp],
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('firstcomplast');
  });

  // @if条件 + 元素 + 组件直接
  it('group-3-if-tag-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){ <span>first</span> }<span>middle</span><my-comp></my-comp>`,
      imports: [MyComp],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('firstmiddlecomp');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('middlecomp');
  });

  // @for循环 + 元素 + 组件直接
  it('group-3-for-tag-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){{{ item }}}<span>middle</span><my-comp></my-comp>`,
      imports: [MyComp],
    })
    class TestComp {
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('xmiddlecomp');
  });

  // @switch + 元素 + 组件直接
  it('group-3-switch-tag-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){ <span>first</span> } }<span>middle</span><my-comp></my-comp>`,
      imports: [MyComp],
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('firstmiddlecomp');
  });

  // 组件直接 + @if条件 + 元素
  it('group-3-component-if-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp>@if(show()){ <span>middle</span> }<span>last</span>`,
      imports: [MyComp],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compmiddlelast');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('complast');
  });

  // 组件直接 + @for循环 + 元素
  it('group-3-component-for-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp>@for(item of items(); track item){ {{ item }} }<span>last</span>`,
      imports: [MyComp],
    })
    class TestComp {
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('comp x last');
  });

  // 组件直接 + @switch + 元素
  it('group-3-component-switch-tag', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<my-comp></my-comp>@switch(state()){ @case(1){ <span>middle</span> } }<span>last</span>`,
      imports: [MyComp],
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compmiddlelast');
  });

  // @if条件 + 模板动态 + 元素
  it('group-3-if-template-tag', async () => {
    @Component({
      template: `
        <ng-template #t>template</ng-template>
        @if(show()){ <ng-container *ngTemplateOutlet="t"></ng-container> }
        <span>MIDDLE</span>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('templateMIDDLE');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('MIDDLE');
  });

  // @for循环 + 模板动态 + 元素
  it('group-3-for-template-tag', async () => {
    @Component({
      template: `
        <ng-template #t>template</ng-template>
        @for(item of items(); track item){{{ item }}}
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <span>MIDDLE</span>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('xtemplateMIDDLE');
  });

  // @switch + 模板动态 + 元素
  it('group-3-switch-template-tag', async () => {
    @Component({
      template: `
        <ng-template #t>template</ng-template>
        @switch(state()){ @case(1){ <span>first</span> } }
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <span>MIDDLE</span>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('firsttemplateMIDDLE');
  });

  // @if条件 + 组件动态 + 元素
  it('group-3-if-component-outlet-tag', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@if(show()){ <span>middle</span> }<span
          >last</span
        >`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicmiddlelast');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamiclast');
  });

  // @for循环 + 组件动态 + 元素
  it('group-3-for-component-outlet-tag', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@for(item of items(); track item){
        {{ item }} }<span>last</span>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamic x last');
  });

  // @switch + 组件动态 + 元素
  it('group-3-switch-component-outlet-tag', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@switch(state()){ @case(1){
        <span>middle</span> } }<span>last</span>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicmiddlelast');
  });

  // @if条件 + @for循环 + 元素
  it('group-3-if-for-tag', async () => {
    @Component({
      template: ` @if(show_a()){A}@for(item of items(); track item){{{ item }}}<span>MIDDLE</span>`,
    })
    class TestComp {
      show_a = signal(true);
      items = signal(['x']);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('AxMIDDLE');
  });

  // @if条件 + @switch + 元素
  it('group-3-if-switch-tag', async () => {
    @Component({
      template: ` @if(show_a()){A}@switch(state()){ @case(1){ <span>M</span> } }<span>last</span>`,
    })
    class TestComp {
      show_a = signal(true);
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('AMlast');
  });

  // @for循环 + @if条件 + 元素
  it('group-3-for-if-tag', async () => {
    @Component({
      template: `@for(item of items(); track item){{{ item }}}@if(show()){ <span>M</span> }<span>last</span>`,
    })
    class TestComp {
      items = signal(['x']);
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('xMlast');
  });

  // @for循环 + @switch + 元素
  it('group-3-for-switch-tag', async () => {
    @Component({
      template: `@for(item of items(); track item){{{ item }}}@switch(state()){ @case(1){ <span>M</span> } }<span
          >last</span
        >`,
    })
    class TestComp {
      items = signal(['x']);
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('xMlast');
  });

  // @switch + @if条件 + 元素
  it('group-3-switch-if-tag', async () => {
    @Component({
      template: `@switch(state()){ @case(1){A} }@if(show()){ <span>M</span> }<span>last</span>`,
    })
    class TestComp {
      state = signal(1);
      show = signal(true);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('AMlast');
  });

  // @switch + @for循环 + 元素
  it('group-3-switch-for-tag', async () => {
    @Component({
      template: `@switch(state()){ @case(1){A} }@for(item of items(); track item){ {{ item }} }<span>last</span>`,
    })
    class TestComp {
      state = signal(1);
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('A x last');
  });

  // ==================== 复杂组合测试 ====================

  it('complex-if-for-nested', async () => {
    @Component({
      template: `@if(show()){ @for(item of items(); track item){ <span>{{ item }}</span> } }`,
    })
    class TestComp {
      show = signal(true);
      items = signal(['a', 'b']);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('ab');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('complex-for-if-inside', async () => {
    @Component({
      template: `@for(item of items(); track item){ @if(item.show){ <span>{{ item.name }}</span> } }`,
    })
    class TestComp {
      items = signal([
        { name: 'a', show: true },
        { name: 'b', show: false },
        { name: 'c', show: true },
      ]);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('ac');
  });

  it('complex-switch-for-inside', async () => {
    @Component({
      template: `@switch(state()){ @case(1){ @for(item of items(); track item){{{ item }}} } }`,
    })
    class TestComp {
      state = signal(1);
      items = signal(['x', 'y']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('xy');
  });

  it('complex-if-switch-inside', async () => {
    @Component({
      template: `@if(show()){ @switch(state()){ @case(1){case-one} @default(){other} } }`,
    })
    class TestComp {
      show = signal(true);
      state = signal(1);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('case-one');
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('other');
  });

  it('complex-component-with-if-content', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `<wrapper>@if(show()){ <span>inside</span> } </wrapper>`,
      imports: [Wrapper],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('inside');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('complex-component-with-for-content', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `<wrapper
        >@for(item of items(); track item){ <span>{{ item }}</span> }
      </wrapper>`,
      imports: [Wrapper],
    })
    class TestComp {
      items = signal(['a', 'b']);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('ab');
  });

  it('complex-mixed-all-types', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <span>start</span>
        <my-comp></my-comp>
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
        @if(show()){ <span>conditional</span> } @for(item of items(); track item){ {{ item }} } @switch(state()){
        @case(1){ <span>switched</span> } }
        <span>end</span>
      `,
      imports: [MyComp, NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      items = signal(['x']);
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(MyComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('startcomptemplatedynamicconditional x switchedend');
  });

  it('complex-order-reversed', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        @for(item of items(); track item){{{ item }}} @if(show()){<span>conditional</span> }
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <my-comp></my-comp>
        <span>end</span>
      `,
      imports: [MyComp, NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
      items = signal(['a']);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('aconditionaltemplatecompend');
  });

  it('complex-empty-conditions', async () => {
    @Component({
      template: `
        @if (falseCondition()) { <span>never</span> } @for (item of empty_items(); track item) { {{ item }} } @empty {
        none } @switch (state()) { @case (999) {matched} @default() {default} }
      `,
    })
    class TestComp {
      falseCondition = signal(false);
      empty_items = signal<string[]>([]);
      state = signal(999);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq(' none matched');
  });

  it('complex-deeply-nested', async () => {
    @Component({
      selector: 'level1',
      template: `<div>l1<ng-content></ng-content></div>`,
    })
    class Level1 {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'level2',
      template: `<span>l2<ng-content></ng-content></span>`,
    })
    class Level2 {
      el = inject(ElementRef);
    }

    @Component({
      template: `<level1><level2>nested</level2></level1>`,
      imports: [Level1, Level2],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(Level1)!.selector,
      reflectComponentType(Level2)!.selector,
    ]);
    expect(element.textContent).eq('l1l2nested');
  });

  it('complex-component-with-ng-content-elements', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `<wrapper><span>1</span><span>2</span><span>3</span></wrapper>`,
      imports: [Wrapper],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('123');
  });

  it('complex-template-with-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <ng-template #t><my-comp></my-comp></ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
      `,
      imports: [MyComp, NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('comp');
  });

  it('complex-component-outlet-with-content', async () => {
    @Component({
      selector: 'content-comp',
      template: `<div><ng-content></ng-content></div>`,
    })
    class ContentComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="ContentComp"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      ContentComp = ContentComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(ContentComp)!.selector]);
    expect(element.textContent).eq('');
  });

  it('template-comp-insert', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <my-comp></my-comp>
        <span>end</span>
      `,
      imports: [MyComp, NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
      items = signal(['a']);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('templatecompend');
  });
});
