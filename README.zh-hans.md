# @cyia/ngx-common

<div align="right">
  <strong>🌐 Language:</strong> <a href="README.md">English</a> | 简体中文
</div>

---

## 快速开始

### 安装

```bash
npm install @cyia/ngx-common
```

Angular 通用工具库，提供无选择器组件渲染、事件修饰符、常用管道等功能。

---

## 目录

- [1. 指令 SelectorlessOutlet](#1-指令-selectorlessoutlet)
- [2. 自定义事件修饰符 EventModifiersPlugin](#2-自定义事件修饰符-eventmodifiersplugin)
- [3. 管道 EnumPipe & PurePipe](#3-管道-enumpipe--purepipe)
- [4. Selectorless 无标签渲染 DomRendererFactory2](#4-selectorless-无标签渲染-domrendererfactory2)

---

## 1. 指令 SelectorlessOutlet

### 功能描述

`SelectorlessOutlet` 是一个结构型指令，用于**动态实例化组件并通过其内部 `<ng-template>` 渲染内容**。

核心机制：

1. 通过 `createComponent` API 在运行时创建指定类型的组件实例（无需在模板中用标签引用）
2. 目标组件必须定义 `<ng-template #templateRef>`，通过 `viewChild.required('templateRef')` 获取
3. 使用 `ViewContainerRef.createEmbeddedView()` 渲染该 TemplateRef，实现组件内容的动态嵌入
4. 支持输入/输出绑定、内容投影、附加指令等完整功能

**适用场景**：需要动态创建组件实例（如从路由、服务或配置中决定显示哪个组件），同时希望组件模板保持独立的场景。

### 安装与使用

#### 方式一：属性绑定语法 `[selectlessOutlet]`

```typescript
import { Component, signal } from '@angular/core';
import { SelectorlessOutlet } from '@cyia/ngx-common/directive';

// 1. 定义目标组件（必须有 #templateRef）
@Component({
  standalone: true,
  template: `
    <ng-template #templateRef>
      <div class="user-card">{{ name() }} — {{ age() }}</div>
    </ng-template>
  `,
})
class UserCardComponent {
  templateRef = viewChild.required('templateRef');
  name = input.required<string>();
  age = input<number>(0);
}

// 2. 在父组件中使用
@Component({
  standalone: true,
  imports: [SelectorlessOutlet],
  template: `
    <ng-template
      [selectlessOutlet]="UserCardComponent"
      [selectlessOutletInputs]="{ name: '张三', age: 25 }"
    ></ng-template>
  `,
})
export class DemoComponent {
  UserCardComponent = UserCardComponent;
}
```

#### 方式二：结构指令语法 `*selectlessOutlet`（推荐）

```html
<!-- 使用 ; 分隔属性和输入 -->
<ng-container *selectlessOutlet="UserCardComponent; inputs: { name: userName, age: userAge }"> </ng-container>
```

### API 参考

| Input 属性                            | 类型                                                                                                               | 说明                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `selectlessOutlet` (required)         | `Type<T>`                                                                                                          | 要创建的组件类型                                                                 |
| `selectlessOutletInputs`              | `Record<string, any>`                                                                                              | 组件 input 的值映射，支持普通值和 signal                                         |
| `selectlessOutletOutputs`             | `Record<string, (event: any) => unknown>`                                                                          | 组件 output 的事件处理函数映射                                                   |
| `selectlessOutletContent`             | `Node[][]`                                                                                                         | 要投影到组件 `<ng-content>` 中的节点数组（二维数组，每个子数组为一组可投影节点） |
| `selectlessOutletDirectives`          | `{ type: Type<any>, inputs?: Record<string, () => unknown>, outputs?: Record<string, (event: any) => unknown> }[]` | 附加指令列表，为动态组件注入额外指令（支持信号式输入/输出绑定）                  |
| `selectlessOutletInjector`            | `Injector`                                                                                                         | 自定义元素注入器                                                                 |
| `selectlessOutletEnvironmentInjector` | `EnvironmentInjector`                                                                                              | 自定义环境注入器                                                                 |

## 2. 自定义事件修饰符 EventModifiersPlugin

### 功能描述

`EventModifiersPlugin` 是一个 Angular `EventManagerPlugin`，为事件绑定提供**链式修饰符**语法。

在标准 Angular 中，`(click)` 只能做简单的事件监听。此插件允许你在事件名后通过 `.` 追加修饰符，实现类似 Vue 的语法：

```html
<!-- 阻止冒泡 + 只触发一次 -->
<button (click.stop.once)="handle()">点击</button>

<!-- 阻止默认行为 -->
<a (click.prevent)="handle()">链接</a>

<!-- 按键修饰符：enter 是 Angular 内置的按键名称 -->
<input (keyup.enter)="handle()" />

<!-- 鼠标按钮修饰符 -->
<button (click.right)="handle()">右键</button>

<!-- 组合修饰符：shift 和 self 都是条件判断修饰符 -->
<button (click.shift.self)="handle()">Shift+点击且目标等于当前元素</button>
```

### 支持的修饰符

| 修饰符    | 说明                                                    |
| --------- | ------------------------------------------------------- |
| `stop`    | 调用 `event.stopPropagation()`，阻止事件冒泡            |
| `prevent` | 调用 `event.preventDefault()`，阻止默认行为             |
| `once`    | 监听器只触发一次后自动移除                              |
| `capture` | 在捕获阶段触发监听器                                    |
| `passive` | 标记为 passive 监听器（提升滚动性能）                   |
| `self`    | 只有事件目标等于当前元素时才触发                        |
| `control` | 需要按下 Ctrl 键                                        |
| `shift`   | 需要按下 Shift 键                                       |
| `alt`     | 需要按下 Alt 键                                         |
| `meta`    | 需要按下 Meta 键（Win/Command）                         |
| `left`    | 只响应鼠标左键点击                                      |
| `right`   | 只响应鼠标右键点击                                      |
| `middle`  | 只响应鼠标中键点击                                      |
| `exact`   | 系统修饰键（ctrl/shift/alt/meta）中**只有**指定的被按下 |

> **注意**：`stop`、`prevent`、`capture`、`once`、`passive` 为内置修饰符，会自动从事件名中移除并执行对应操作；其他修饰符（如 `control`、`shift`、`alt`、`meta`、`self`、`left`、`right`、`middle`、`exact`）为条件判断修饰符，仅当条件满足时才触发回调。

### 自定义修饰符

通过提供 `EVENT_MODIFIER_OPTIONS` 可以注册自定义修饰符：

- **map**：转换事件数据，接收 `(input: any, modifiers: string[]) => any`
- **guard**：守卫函数，返回 `boolean | Promise<boolean>`，为 `true` 时阻止回调执行

```typescript
{
  provide: EVENT_MODIFIER_OPTIONS,
  useValue: {
    modifiers: {
      map: {
        uppercase: (value) => value?.toUpperCase(),
        prefix: (value) => `prefix:${value}`,
      },
      guard: {
        delay: () => new Promise((res) => setTimeout(() => res(false), 1000)),
        disable: () => true,
        enable: () => false,
      },
    },
    componentOutput: true, // 启用组件 @Output() 支持
  },
}
```

### 使用

在 `bootstrapApplication` 中注册：

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { EVENT_MANAGER_PLUGINS, DOCUMENT } from '@angular/core';
import { EventModifiersPlugin, EVENT_MODIFIER_OPTIONS } from '@cyia/ngx-common/event';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: EventModifiersPlugin,
      multi: true,
      deps: [DOCUMENT],
    },
    {
      provide: EVENT_MODIFIER_OPTIONS,
      useValue: {
        modifiers: {
          map: {
            prefix: (value) => `prefix:${value}`,
          },
          guard: {
            delay: () => new Promise((res) => setTimeout(() => res(false), 1000)),
            disable: () => true,
            enable: () => false,
          },
        },
        componentOutput: true,
      },
    },
  ],
});
```

### 完整 Demo

```html
<!-- stop + once：第一次点击子按钮由子级处理并移除监听，之后冒泡到父级 -->
<div (click)="log('parent')">
  <button (click.stop.once)="log('child')">只点一次</button>
</div>

<!-- 自定义修饰符：uppercase 将事件数据转为大写（需在 EVENT_MODIFIER_OPTIONS.map 中配置） -->
<app-a (output2.prefix.uppercase)="handle($event)"></app-a>

<!-- 延迟触发（需在 EVENT_MODIFIER_OPTIONS.guard 中配置 delay） -->
<button (click.delay)="log('delayed')">延迟按钮</button>

<!-- 启用/禁用开关（需在 EVENT_MODIFIER_OPTIONS.guard 中配置 enable/disable） -->
<button (click.enable)="log('enabled')">允许点击</button>
<button (click.disable)="log('disabled')">禁止点击</button>

<!-- 组合修饰符：control 和 shift 同时满足才触发 -->
<input (keydown.control.shift)="handle()" />

<!-- 鼠标右键 -->
<button (mousedown.right)="handle()">右键专用</button>

<!-- self：只有直接点击元素本身（非子元素）才触发 -->
<div (click.self)="log('direct click')">
  点击我或我的子元素
  <span>我是子元素</span>
</div>
```

### 绑定组件 Output

启用 `componentOutput: true` 后，可以修饰组件的 `@Output()` ：

```html
<app-child (myOutput.stop.once)="handle($event)"></app-child>
```

---

## 3. 管道 EnumPipe & PurePipe

### 3.1 EnumPipe — 枚举值映射

#### 功能描述

将枚举值（数字或字符串）映射为可读的文本标签。支持 `Map` 和 `Record` 两种数据结构。

#### 用法

```html
<!-- 基本用法：Map -->
<p>{{ status | enum : statusMap }}</p>

<!-- 带默认值 -->
<p>{{ status | enum : statusMap : '未知' }}</p>

<!-- Record / 对象 -->
<p{{ color | enum : { R: '红色', G: '绿色', B: '蓝色' } }}</p>
```

```typescript
import { EnumPipe } from '@cyia/ngx-common/pipe';

export enum Status {
  Pending = 0,
  Active = 1,
  Inactive = 2,
}

const statusMap = new Map([
  [Status.Pending, '待处理'],
  [Status.Active, '进行中'],
  [Status.Inactive, '已关闭'],
]);

// 或者用对象
const colorMap = { R: '红色', G: '绿色', B: '蓝色' };
```

---

### 3.2 PurePipe — 纯函数管道

#### 功能描述

将任意函数作为纯管道使用。Angular 的纯管道会在输入引用不变时跳过执行，此管道让你可以**对任何同步函数应用同样的缓存行为**。

适用于避免在模板中直接调用复杂计算函数导致每次变更检测都重新执行。

#### 用法

```html
<!-- 基本用法：管道左侧是函数，右侧参数依次传入函数 -->
<p>{{ filterFn | pure : items }}</p>

<!-- 多个参数 -->
<p>{{ combine | pure : value : arg1 : arg2 }}</p>

<!-- 与信号一起使用 -->
<p>{{ formatNumber | pure : value$() }}</p>
```

```typescript
import { PurePipe } from '@cyia/ngx-common/pipe';

@Component({
  template: `
    <!-- 过滤后的列表（仅当 items 引用变化时才重新计算） -->
    <ul>
      @for (item of filterItems | pure : items; track item.id) {
        <li>{{ item.name }}</li>
      }
    </ul>
  `,
  imports: [PurePipe],
})
export class DemoComponent {
  items = signal([{ id: 1, name: 'A' }, { id: 2, name: 'B' }]);

  filterItems(items: typeof this.items()) {
    // 这个函数会被 PurePipe 缓存，仅在 items 引用变化时重新执行
    return items.filter((i) => i.name.startsWith('A'));
  }
}
```

---

## 4. Selectorless 无标签渲染 DomRendererFactory2

### 功能描述

这是一个**自定义的 RendererFactory2**，核心能力是：**将指定选择器的 Angular 组件在 DOM 中"隐藏"其标签**。

换句话说，如果你的组件 `<my-comp>` 被加入排除列表，渲染出来的 DOM 中将不会出现 `<my-comp></my-comp>` 标签，而是直接显示组件内部的子元素。

> **这与 SelectorlessOutlet 的关系**：两者都致力于实现"无标签"效果，但方式不同——`SelectorlessOutlet` 通过指令动态创建组件；而 `DomRendererFactory2` 是在渲染层面拦截 `createElement`，将匹配选择器的组件替换为代理节点（ProxyNode），在 DOM 中透明地展平其子树。

### 工作原理

1. 注册需要排除的选择器列表
2. 设置自定义的 `DomRendererFactory2` 替代默认的 RendererFactory
3. Angular 渲染时，遇到已注册的组件选择器会创建 `ProxyNode` 而非真实 DOM 元素
4. `ProxyNode` 将组件的子节点直接插入到父容器中，实现标签透明化

### 使用

#### 注册排除的选择器

```typescript
import { selectorlessExcludeTag, setSelectorlessFilter } from '@cyia/ngx-common/service';

// 方式一：逐个添加
selectorlessExcludeTag('my-comp');
selectorlessExcludeTag('user-card');

// 方式二：批量设置过滤器（推荐）
// 排除所有以 'app-' 开头的选择器
setSelectorlessFilter((name) => name.startsWith('app-'));
```

#### 在 bootstrapApplication 中注册

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { DomRendererFactory2 } from '@cyia/ngx-common/service';

bootstrapApplication(AppComponent, {
  providers: [DomRendererFactory2, { provide: RendererFactory2, useExisting: DomRendererFactory2 }],
});
```

#### 正常实现组件

- 组件中不要使用 styles/styleUrl(放到全局中)

---
