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
      imports: [NgComponentOutlet],
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
      imports: [NgComponentOutlet],
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
      imports: [NgComponentOutlet],
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
      imports: [NgComponentOutlet],
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
      imports: [NgComponentOutlet],
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
      imports: [StaticComp, NgComponentOutlet],
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

  // ==================== 补充缺失的3元素分组测试 ====================

  // 元素 + 组件直接 + 组件动态
  it('group-3-tag-component-component-outlet', async () => {
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
      template: `<span>first</span><static-comp></static-comp
        ><ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [StaticComp, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(StaticComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('firststaticdynamic');
  });

  // 元素 + 模板动态 + 组件动态
  it('group-3-tag-template-component-outlet', async () => {
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
        <span>first</span>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
      `,
      imports: [NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('firsttemplatedynamic');
  });

  // 组件直接 + 元素 + 组件动态
  it('group-3-component-tag-component-outlet', async () => {
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
      template: `<static-comp></static-comp><span>MIDDLE</span
        ><ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [StaticComp, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(StaticComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('staticMIDDLEdynamic');
  });

  // 组件直接 + 模板动态 + 组件动态
  it('group-3-component-template-component-outlet', async () => {
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
      template: `<static-comp></static-comp><ng-template #t>template</ng-template
        ><ng-container *ngTemplateOutlet="t"></ng-container><ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [StaticComp, NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(StaticComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('statictemplatedynamic');
  });

  // 模板动态 + 元素 + 组件动态
  it('group-3-template-tag-component-outlet', async () => {
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
        <span>MIDDLE</span>
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
      `,
      imports: [NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('templateMIDDLEdynamic');
  });

  // 模板动态 + 组件动态 + 元素
  it('group-3-template-component-outlet-tag', async () => {
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
        <span>last</span>
      `,
      imports: [NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('templatedynamiclast');
  });

  // 组件动态 + 元素 + 模板动态
  it('group-3-component-outlet-tag-template', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
        <span>MIDDLE</span>
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
      `,
      imports: [NgComponentOutlet, NgTemplateOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicMIDDLEtemplate');
  });

  // 组件动态 + 模板动态 + 元素
  it('group-3-component-outlet-template-tag', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <span>last</span>
      `,
      imports: [NgComponentOutlet, NgTemplateOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamictemplatelast');
  });

  // @if条件 + 组件动态 + @if条件
  it('group-3-if-component-outlet-if', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@if(a()){A}@if(b()){B}`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      a = signal(true);
      b = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicAB');
    instance.a.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamicB');
  });

  // @for循环 + 组件动态 + @for循环
  it('group-3-for-component-outlet-for', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items1(); track item){{{ item }}}<ng-container *ngComponentOutlet="DynComp"></ng-container
        >@for(item of items2(); track item){{{ item }}}`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items1 = signal(['a']);
      items2 = signal(['b']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('adynamicb');
  });

  // @switch + 组件动态 + @switch
  it('group-3-switch-component-outlet-switch', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(s1()){ @case(1){A} }<ng-container *ngComponentOutlet="DynComp"></ng-container>@switch(s2()){
        @case(2){B} }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      s1 = signal(1);
      s2 = signal(2);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('AdynamicB');
  });

  // 组件动态 + @if条件 + 组件动态
  it('group-3-component-outlet-if-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@if(show()){ <span>M</span> }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicMdynamic');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamicdynamic');
  });

  // 组件动态 + @for循环 + 组件动态
  it('group-3-component-outlet-for-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@for(item of items(); track item){{{ item




        }}}<ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicxdynamic');
  });

  // 组件动态 + @switch + 组件动态
  it('group-3-component-outlet-switch-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@switch(state()){ @case(1){M} }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicMdynamic');
  });

  // 元素 + @if条件 + 组件动态
  it('group-3-tag-if-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>first</span>@if(show()){ <span>middle</span> }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('firstmiddledynamic');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('firstdynamic');
  });

  // 元素 + @for循环 + 组件动态
  it('group-3-tag-for-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>before</span>@for(item of items(); track item){{{ item }}}<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('beforexdynamic');
  });

  // 元素 + @switch + 组件动态
  it('group-3-tag-switch-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<span>before</span>@switch(state()){ @case(1){ <span>M</span> } }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('beforeMdynamic');
  });

  // @if条件 + 元素 + 组件动态
  it('group-3-if-tag-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){ <span>first</span> }<span>MIDDLE</span
        ><ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('firstMIDDLEdynamic');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('MIDDLEdynamic');
  });

  // @for循环 + 元素 + 组件动态
  it('group-3-for-tag-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){{{ item }}}<span>MIDDLE</span
        ><ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('xMIDDLEdynamic');
  });

  // @switch + 元素 + 组件动态
  it('group-3-switch-tag-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){ <span>first</span> } }<span>MIDDLE</span
        ><ng-container *ngComponentOutlet="DynComp"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('firstMIDDLEdynamic');
  });

  // 组件动态 + 元素 + @if条件
  it('group-3-component-outlet-tag-if', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container><span>MIDDLE</span>@if(show()){
        <span>last</span> }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicMIDDLElast');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamicMIDDLE');
  });

  // 组件动态 + 元素 + @for循环
  it('group-3-component-outlet-tag-for', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container><span>MIDDLE</span>@for(item of items();
        track item){{{ item }}}`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicMIDDLEx');
  });

  // 组件动态 + 元素 + @switch
  it('group-3-component-outlet-tag-switch', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container><span>MIDDLE</span>@switch(state()){
        @case(1){ <span>last</span> } }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicMIDDLElast');
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
      template: `@if(show()){ <ng-container *ngComponentOutlet="DynComp"></ng-container> }<span>MIDDLE</span
        ><span>last</span>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicMIDDLElast');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('MIDDLElast');
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
      template: `@for(item of items(); track item){{{ item }}}<ng-container *ngComponentOutlet="DynComp"></ng-container
        ><span>last</span>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('xdynamiclast');
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
      template: `@switch(state()){ @case(1){ <span>first</span> } }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container
        ><span>last</span>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('firstdynamiclast');
  });

  // @if条件 + 组件动态 + 模板动态
  it('group-3-if-component-outlet-template', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){ <ng-container *ngComponentOutlet="DynComp"></ng-container> }<ng-template #t
          >template</ng-template
        ><ng-container *ngTemplateOutlet="t"></ng-container>`,
      imports: [NgComponentOutlet, NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamictemplate');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('template');
  });

  // @for循环 + 组件动态 + 模板动态
  it('group-3-for-component-outlet-template', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){{{ item }}}<ng-container *ngComponentOutlet="DynComp"></ng-container
        ><ng-template #t>template</ng-template><ng-container *ngTemplateOutlet="t"></ng-container>`,
      imports: [NgComponentOutlet, NgTemplateOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('xdynamictemplate');
  });

  // @switch + 组件动态 + 模板动态
  it('group-3-switch-component-outlet-template', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){ <span>first</span> } }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container
        ><ng-template #t>template</ng-template><ng-container *ngTemplateOutlet="t"></ng-container>`,
      imports: [NgComponentOutlet, NgTemplateOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('firstdynamictemplate');
  });

  // @if条件 + 模板动态 + 组件动态
  it('group-3-if-template-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-template #t>template</ng-template>@if(show()){
        <ng-container *ngTemplateOutlet="t"></ng-container> }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet, NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('templatedynamic');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamic');
  });

  // @for循环 + 模板动态 + 组件动态
  it('group-3-for-template-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-template #t>template</ng-template>@for(item of items(); track item){{{ item }}}<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('xdynamic');
  });

  // @switch + 模板动态 + 组件动态
  it('group-3-switch-template-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-template #t>template</ng-template>@switch(state()){ @case(1){ <span>M</span> } }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('Mdynamic');
  });

  // @if条件 + @for循环 + 组件动态 (3个)
  it('group-3-if-for-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){A}@for(item of items(); track item){{{ item }}}<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('Axdynamic');
  });

  // @if条件 + @switch + 组件动态 (3个)
  it('group-3-if-switch-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){A}@switch(state()){ @case(1){M} }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('AMdynamic');
  });

  // @for循环 + @if条件 + 组件动态 (3个)
  it('group-3-for-if-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){{{ item }}}@if(show()){ <span>M</span> }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('xMdynamic');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('xdynamic');
  });

  // @for循环 + @switch + 组件动态 (3个)
  it('group-3-for-switch-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){{{ item }}}@switch(state()){ @case(1){M} }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('xMdynamic');
  });

  // @switch + @if条件 + 组件动态 (3个)
  it('group-3-switch-if-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){A} }@if(show()){ <span>M</span> }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('AMdynamic');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('Adynamic');
  });

  // @switch + @for循环 + 组件动态 (3个)
  it('group-3-switch-for-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){A} }@for(item of items(); track item){{{ item }}}<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('Axdynamic');
  });

  // @if条件 + 组件动态 + @for循环 (3个)
  it('group-3-if-component-outlet-for', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){A}<ng-container *ngComponentOutlet="DynComp"></ng-container>@for(item of items(); track
        item){{{ item }}}`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('Adynamicx');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamicx');
  });

  // @for循环 + 组件动态 + @if条件 (3个)
  it('group-3-for-component-outlet-if', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){{{ item }}}<ng-container *ngComponentOutlet="DynComp"></ng-container
        >@if(show()){ <span>M</span> }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('xdynamicM');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('xdynamic');
  });

  // @switch + 组件动态 + @for循环 (3个)
  it('group-3-switch-component-outlet-for', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){A} }<ng-container *ngComponentOutlet="DynComp"></ng-container>@for(item of
        items(); track item){{{ item }}}`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      items = signal(['x']);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('Adynamicx');
  });

  // @for循环 + 组件动态 + @switch (3个)
  it('group-3-for-component-outlet-switch', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){{{ item }}}<ng-container *ngComponentOutlet="DynComp"></ng-container
        >@switch(state()){ @case(1){M} }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      items = signal(['x']);
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('xdynamicM');
  });

  // @if条件 + 组件动态 + @switch (3个)
  it('group-3-if-component-outlet-switch', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){A}<ng-container *ngComponentOutlet="DynComp"></ng-container>@switch(state()){ @case(1){M} }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('AdynamicM');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamicM');
  });

  // @switch + 组件动态 + @if条件 (3个)
  it('group-3-switch-component-outlet-if', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){A} }<ng-container *ngComponentOutlet="DynComp"></ng-container>@if(show()){
        <span>M</span> }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      state = signal(1);
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('AdynamicM');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('Adynamic');
  });

  // ==================== 补充缺失的2元素分组测试 ====================

  // 组件动态 + @if条件(验证else分支)
  it('group-2-component-outlet-if-else', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="DynComp"></ng-container>@if(show()){ <span>shown</span> }@else{
        <span>hidden</span> }`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamicshown');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('dynamichidden');
  });

  // @if条件 + 组件动态(验证if的else分支)
  it('group-2-if-component-outlet-else', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){ <span>shown</span> }@else{ <span>hidden</span> }<ng-container
          *ngComponentOutlet="DynComp"
        ></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('showndynamic');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('hiddendynamic');
  });

  // @for循环 + @if条件(验证for为空时)
  it('group-2-for-if-empty', async () => {
    @Component({
      template: `@for(item of items(); track item){{{ item }}}@empty{none}@if(show()){A}`,
    })
    class TestComp {
      show = signal(true);
      items = signal<string[]>([]);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('noneA');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('none');
  });

  // @if条件 + @for循环(验证if为false时)
  it('group-2-if-for-false', async () => {
    @Component({
      template: `@if(show()){A}@for(item of items(); track item){{{ item }}}@empty{none}`,
    })
    class TestComp {
      show = signal(false);
      items = signal<string[]>([]);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('none');
    instance.show.set(true);
    fixture.detectChanges();
    expect(element.textContent).eq('Anone');
  });

  // @switch + @for循环(验证switch default时)
  it('group-2-switch-for-default', async () => {
    @Component({
      template: `@switch(state()){ @case(1){A} @default(){D} }@for(item of items(); track item){{{ item }}}`,
    })
    class TestComp {
      state = signal(2);
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('Dx');
  });

  // @for循环 + @switch(验证for为空时)
  it('group-2-for-switch-empty', async () => {
    @Component({
      template: `@for(item of items(); track item){{{ item }}}@empty{none}@switch(state()){ @case(1){A} @default(){D} }`,
    })
    class TestComp {
      state = signal(99);
      items = signal<string[]>([]);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('noneD');
  });

  // ==================== 补充复杂嵌套测试 ====================

  it('complex-nested-if-for-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@if(show()){ @for(item of items(); track item){ <my-comp></my-comp> } }`,
      imports: [MyComp],
    })
    class TestComp {
      show = signal(true);
      items = signal(['a', 'b']);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compcomp');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('complex-nested-for-if-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@for(item of items(); track item){ @if(item.active){ <my-comp></my-comp> } }`,
      imports: [MyComp],
    })
    class TestComp {
      items = signal([{ active: true }, { active: false }, { active: true }]);
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compcomp');
  });

  it('complex-nested-switch-for-component', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `@switch(state()){ @case(1){ @for(item of items(); track item){ <my-comp></my-comp> } } @default(){none}
        }`,
      imports: [MyComp],
    })
    class TestComp {
      state = signal(1);
      items = signal(['a', 'b']);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compcomp');
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('none');
  });

  it('complex-nested-component-switch-content', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `<wrapper>@switch(state()){ @case(1){ <my-comp></my-comp> } @default(){text} } </wrapper>`,
      imports: [Wrapper, MyComp],
    })
    class TestComp {
      state = signal(1);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(Wrapper)!.selector,
      reflectComponentType(MyComp)!.selector,
    ]);
    expect(element.textContent).eq('comp');
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('text');
  });

  it('complex-template-with-if-content', async () => {
    @Component({
      template: `
        <ng-template #t> @if(show()){inside} </ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('inside');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('');
  });

  it('complex-component-outlet-with-if-content', async () => {
    @Component({
      selector: 'content-comp',
      template: `<div>@if(show()){ <span>inside</span> }</div>`,
    })
    class ContentComp {
      el = inject(ElementRef);
      show = signal(true);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="ContentComp"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      ContentComp = ContentComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(ContentComp)!.selector]);
    expect(element.textContent).eq('inside');
  });

  it('complex-mixed-4-types', async () => {
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
        <span>end</span>
      `,
      imports: [MyComp, NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(MyComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('startcomptemplatedynamicend');
  });

  it('complex-all-types-with-conditions', async () => {
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
        @if(show_comp()){ <my-comp></my-comp> } @else{ <span>no-comp</span> }
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        @for(item of items(); track item){ <span>{{ item }}</span> } @empty{none}
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
        @switch(state()){ @case(1){ <span>one</span> } @default(){other} }
        <span>end</span>
      `,
      imports: [MyComp, NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      show_comp = signal(true);
      items = signal(['a']);
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(MyComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('startcomptemplateadynamiconeend');
    instance.show_comp.set(false);
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('startno-comptemplateadynamicotherend');
  });

  it('complex-deep-nesting-3-level', async () => {
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
      selector: 'level3',
      template: `<em>l3<ng-content></ng-content></em>`,
    })
    class Level3 {
      el = inject(ElementRef);
    }

    @Component({
      template: `<level1
        ><level2><level3>deep</level3></level2></level1
      >`,
      imports: [Level1, Level2, Level3],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(Level1)!.selector,
      reflectComponentType(Level2)!.selector,
      reflectComponentType(Level3)!.selector,
    ]);
    expect(element.textContent).eq('l1l2l3deep');
  });

  it('complex-component-with-template-content', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <ng-template #t><span>in-template</span></ng-template>
        <wrapper><ng-container *ngTemplateOutlet="t"></ng-container></wrapper>
      `,
      imports: [Wrapper, NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('in-template');
  });

  it('complex-component-outlet-with-for-content', async () => {
    @Component({
      selector: 'content-comp',
      template: `<div>
        @for(item of items; track item){ <span>{{ item }}</span> }
      </div>`,
      inputs: ['items'],
    })
    class ContentComp {
      el = inject(ElementRef);
      items: string[] = [];
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="ContentComp; inputs: compInputs"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      ContentComp = ContentComp;
      compInputs = { items: ['a', 'b'] };
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(ContentComp)!.selector]);
    expect(element.textContent).eq('ab');
  });

  it('complex-template-with-component-outlet', async () => {
    @Component({
      selector: 'dyn-comp',
      template: `dynamic`,
    })
    class DynComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <ng-template #t>
          <ng-container *ngComponentOutlet="DynComp"></ng-container>
        </ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
      `,
      imports: [NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(DynComp)!.selector]);
    expect(element.textContent).eq('dynamic');
  });

  it('complex-mixed-reverse-order', async () => {
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
        <span>end</span>
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <my-comp></my-comp>
        <span>start</span>
      `,
      imports: [MyComp, NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(MyComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('enddynamictemplatecompstart');
  });

  it('complex-if-for-switch-mixed', async () => {
    @Component({
      template: `@if(show()){ @for(item of items(); track item){{{ item }}} @empty{none}}@switch(state()){ @case(1){A}
        @default(){B} }`,
    })
    class TestComp {
      show = signal(true);
      items = signal(['x', 'y']);
      state = signal(1);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('xyA');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('A');
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('B');
  });

  it('complex-for-if-switch-mixed', async () => {
    @Component({
      template: `@for(item of items(); track item){ @if(item.a){A} @else{B} }@switch(state()){ @case(1){X} @default(){Y}
      }`,
    })
    class TestComp {
      items = signal([{ a: true }, { a: false }]);
      state = signal(1);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('ABX');
  });

  it('complex-switch-if-for-mixed', async () => {
    @Component({
      template: `@switch(state()){ @case(1){ @if(show()){A} @else{B} } @default(){C} }@for(item of items(); track
        item){{{ item }}}`,
    })
    class TestComp {
      state = signal(1);
      show = signal(true);
      items = signal(['x']);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('Ax');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('Bx');
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('Cx');
  });

  it('complex-all-conditions-with-components', async () => {
    @Component({
      selector: 'my-comp',
      template: `comp`,
    })
    class MyComp {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        @if(show()){ <my-comp></my-comp> } @for(item of items(); track item){ <my-comp></my-comp> } @empty{none}
        @switch(state()){ @case(1){ <my-comp></my-comp> } @default(){default} }
      `,
      imports: [MyComp],
    })
    class TestComp {
      show = signal(true);
      items = signal(['a', 'b']);
      state = signal(1);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(MyComp)!.selector]);
    expect(element.textContent).eq('compcompcompcomp');
    instance.show.set(false);
    instance.items.set([]);
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('nonedefault');
  });

  it('complex-component-content-with-all-conditions', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `<wrapper>
        @if(show()){ <span>a</span> } @for(item of items(); track item){ <span>{{ item }}</span> } @empty{none}
        @switch(state()){ @case(1){ <span>one</span> } @default(){other} }
      </wrapper>`,
      imports: [Wrapper],
    })
    class TestComp {
      show = signal(true);
      items = signal(['x']);
      state = signal(1);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('axone');
    instance.show.set(false);
    instance.items.set([]);
    instance.state.set(2);
    fixture.detectChanges();
    expect(element.textContent).eq('noneother');
  });

  it('complex-template-outlet-with-conditions', async () => {
    @Component({
      template: `
        <ng-template #a>template-a</ng-template>
        <ng-template #b>template-b</ng-template>
        @if(show_a()){ <ng-container *ngTemplateOutlet="a"></ng-container> } @else{
        <ng-container *ngTemplateOutlet="b"></ng-container> }
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {
      show_a = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp);
    expect(element.textContent).eq('template-a');
    instance.show_a.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('template-b');
  });

  it('complex-component-outlet-with-conditions', async () => {
    @Component({
      selector: 'comp-a',
      template: `comp-a`,
    })
    class CompA {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'comp-b',
      template: `comp-b`,
    })
    class CompB {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="selected()"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      selected = signal(CompA);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(CompA)!.selector,
      reflectComponentType(CompB)!.selector,
    ]);
    expect(element.textContent).eq('comp-a');
    instance.selected.set(CompB);
    fixture.detectChanges();
    expect(element.textContent).eq('comp-b');
  });

  it('complex-mixed-static-dynamic', async () => {
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
      template: `
        <span>1</span>
        <static-comp></static-comp>
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
        <span>5</span>
      `,
      imports: [StaticComp, NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      DynComp = DynComp;
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(StaticComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('1statictemplatedynamic5');
  });

  it('complex-all-permutations-2-element', async () => {
    @Component({
      selector: 'tag-el',
      template: `tag`,
    })
    class TagEl {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'comp-a',
      template: `compA`,
    })
    class CompA {
      el = inject(ElementRef);
    }

    @Component({
      selector: 'comp-b',
      template: `compB`,
    })
    class CompB {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <span>el1</span><span>el2</span> <comp-a></comp-a><comp-b></comp-b>
        <ng-template #t>t-content</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        @if(show()){ <span>cond</span> } @for(item of items(); track item){{{ item }}}
      `,
      imports: [NgTemplateOutlet, CompA, CompB],
    })
    class TestComp {
      show = signal(true);
      items = signal(['x']);
    }
    let { fixture, element } = await createComponent(TestComp, [
      reflectComponentType(CompA)!.selector,
      reflectComponentType(CompB)!.selector,
    ]);
    expect(element.textContent).eq('el1el2compAcompBt-contentcondx');
  });

  it('complex-all-permutations-3-element', async () => {
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
        <span>el</span>
        <my-comp></my-comp>
        <ng-template #t>t-content</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
        <ng-container *ngComponentOutlet="DynComp"></ng-container>
        @if(show()){ <span>cond</span> } @for(item of items(); track item){{{ item }}} @switch(state()){ @case(1){
        <span>sw</span> } }
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
    expect(element.textContent).eq('elcompt-contentdynamiccondxsw');
  });

  it('complex-empty-all-conditions', async () => {
    @Component({
      template: `
        @if(false){ <span>never</span> } @for(item of empty(); track item){{{ item }}} @empty{none} @switch(none()){
        @case(1){one} @default(){default} }
      `,
    })
    class TestComp {
      empty = signal<string[]>([]);
      none = signal(999);
    }
    let { fixture, element } = await createComponent(TestComp);
    expect(element.textContent).eq('nonedefault');
  });

  it('complex-component-with-template-and-conditions', async () => {
    @Component({
      selector: 'wrapper',
      template: `<div><ng-content></ng-content></div>`,
    })
    class Wrapper {
      el = inject(ElementRef);
    }

    @Component({
      template: `
        <ng-template #t>
          <span>in-template</span>
          @if(show()){ <span>extra</span> }
        </ng-template>
        <wrapper><ng-container *ngTemplateOutlet="t"></ng-container></wrapper>
      `,
      imports: [Wrapper, NgTemplateOutlet],
    })
    class TestComp {
      show = signal(true);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [reflectComponentType(Wrapper)!.selector]);
    expect(element.textContent).eq('in-templateextra');
    instance.show.set(false);
    fixture.detectChanges();
    expect(element.textContent).eq('in-template');
  });

  it('complex-component-outlet-dynamic-with-conditions', async () => {
    @Component({
      selector: 'comp-a',
      template: `A@if(show()){ -extra }`,
    })
    class CompA {
      el = inject(ElementRef);
      show = signal(true);
    }

    @Component({
      selector: 'comp-b',
      template: `B`,
    })
    class CompB {
      el = inject(ElementRef);
    }

    @Component({
      template: `<ng-container *ngComponentOutlet="selected()"></ng-container>`,
      imports: [NgComponentOutlet],
    })
    class TestComp {
      selected = signal<Type<any>>(CompA);
    }
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(CompA)!.selector,
      reflectComponentType(CompB)!.selector,
    ]);
    expect(element.textContent).eq('A -extra ');
    instance.selected.set(CompB);
    fixture.detectChanges();
    expect(element.textContent).eq('B');
  });

  it('complex-nested-conditions-in-component', async () => {
    @Component({
      selector: 'nested-comp',
      template: `
        @if(a()){A} @for(item of items(); track item){{{ item }}} @empty{ none } @switch(s()){ @case(1){one}
        @default(){other} }
      `,
    })
    class NestedComp {
      a = signal(true);
      items = signal(['x']);
      s = signal(1);
    }

    @Component({
      template: `<nested-comp></nested-comp>`,
      imports: [NestedComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(NestedComp)!.selector]);
    expect(element.textContent).eq('Axone');
  });

  it('complex-mixed-all-with-proxy', async () => {
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
        @if(show()){ <span>conditional</span> } @for(item of items(); track item){{{ item }}} @switch(state()){
        @case(1){ <span>switched</span> } @default(){other} }
        <span>end</span>
      `,
      imports: [MyComp, NgTemplateOutlet, NgComponentOutlet],
    })
    class TestComp {
      show = signal(true);
      items = signal(['x', 'y']);
      state = signal(1);
      DynComp = DynComp;
    }
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(MyComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('startcomptemplatedynamicconditionalxyswitchedend');
    instance.show.set(false);
    instance.state.set(2);
    instance.items.set([]);
    fixture.detectChanges();
    expect(element.textContent).eq('startcomptemplatedynamicotherend');
  });
  it('complex-mixed-all-with-proxy', async () => {
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
        <ng-template #t>template</ng-template>
        <ng-container *ngTemplateOutlet="t"></ng-container>
      `,
      imports: [NgTemplateOutlet],
    })
    class TestComp {}
    let { fixture, element, instance } = await createComponent(TestComp, [
      reflectComponentType(MyComp)!.selector,
      reflectComponentType(DynComp)!.selector,
    ]);
    expect(element.textContent).eq('template');
  });
  it('complex-nested-conditions-in-component', async () => {
    @Component({
      selector: 'nested-comp',
      template: ` @if(s()){one} `,
    })
    class NestedComp {
      s = signal(1);
    }

    @Component({
      template: `<nested-comp></nested-comp>`,
      imports: [NestedComp],
    })
    class TestComp {}
    let { fixture, element } = await createComponent(TestComp, [reflectComponentType(NestedComp)!.selector]);
    expect(element.textContent).eq('one');
  });
});
