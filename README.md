# @cyia/ngx-common

<div align="right">
  <strong>🌐 Language:</strong> English | <a href="README.zh-hans.md">简体中文</a>
</div>

---

## Quick Start

### Installation

```bash
npm install @cyia/ngx-common
```

Angular utility library providing selectorless component rendering, event modifiers, common pipes, and more.

---

## Table of Contents

- [1. Directive SelectorlessOutlet](#1-directive-selectorlessoutlet)
- [2. Custom Event Modifiers EventModifiersPlugin](#2-custom-event-modifiers-eventmodifiersplugin)
- [3. Pipes EnumPipe & PurePipe](#3-pipes-enumpipe--purepipe)
- [4. Selectorless Tagless Rendering DomRendererFactory2](#4-selectorless-tagless-rendering-domrendererfactory2)

---

## 1. Directive SelectorlessOutlet

### Description

`SelectorlessOutlet` is a structural directive used to **dynamically instantiate components and render content via their internal `<ng-template>`**.

Core mechanism:

1. Uses the `createComponent` API to create a component instance of the specified type at runtime (no tag reference needed in template).
2. The target component must define `<ng-template #templateRef>`, obtained via `viewChild.required('templateRef')`.
3. Uses `ViewContainerRef.createEmbeddedView()` to render that TemplateRef, enabling dynamic embedding of component content.
4. Supports full functionality like input/output binding, content projection, additional directives, etc.

**Use cases**: When you need to dynamically create component instances (e.g., determining which component to show based on route, service or configuration) while keeping component templates independent.

### Installation and Usage

#### Method 1: Property binding syntax `[selectlessOutlet]`

```typescript
import { Component, signal } from '@angular/core';
import { SelectorlessOutlet } from '@cyia/ngx-common/directive';

// 1. Define target component (must have #templateRef)
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

// 2. Use in parent component
@Component({
  standalone: true,
  imports: [SelectorlessOutlet],
  template: `
    <ng-template
      [selectlessOutlet]="UserCardComponent"
      [selectlessOutletInputs]="{ name: 'John', age: 25 }"
    ></ng-template>
  `,
})
export class DemoComponent {
  UserCardComponent = UserCardComponent;
}
```

#### Method 2: Structural directive syntax `*selectlessOutlet` (recommended)

```html
<!-- Use ; to separate properties and inputs -->
<ng-container *selectlessOutlet="UserCardComponent; inputs: { name: userName, age: userAge }"> </ng-container>
```

### API Reference

| Input Property                        | Type                                                                                                               | Description                                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `selectlessOutlet` (required)         | `Type<T>`                                                                                                          | Component type to create                                                                                                      |
| `selectlessOutletInputs`              | `Record<string, any>`                                                                                              | Mapping of component input values, supports plain values and signals                                                          |
| `selectlessOutletOutputs`             | `Record<string, (event: any) => unknown>`                                                                          | Mapping of component output event handlers                                                                                    |
| `selectlessOutletContent`             | `Node[][]`                                                                                                         | Array of nodes to project into the component's `<ng-content>` (two-dimensional, each sub-array is a set of projectable nodes) |
| `selectlessOutletDirectives`          | `{ type: Type<any>, inputs?: Record<string, () => unknown>, outputs?: Record<string, (event: any) => unknown> }[]` | List of additional directives to attach to the dynamic component (supports signal-based input/output bindings)                |
| `selectlessOutletInjector`            | `Injector`                                                                                                         | Custom element injector                                                                                                       |
| `selectlessOutletEnvironmentInjector` | `EnvironmentInjector`                                                                                              | Custom environment injector                                                                                                   |

## 2. Custom Event Modifiers EventModifiersPlugin

### Description

`EventModifiersPlugin` is an Angular `EventManagerPlugin` that provides **chained modifier** syntax for event bindings.

In standard Angular, `(click)` can only do simple event listening. This plugin allows you to append modifiers to event names using `.` to achieve Vue-like syntax:

```html
<!-- Stop propagation + fire only once -->
<button (click.stop.once)="handle()">Click</button>

<!-- Prevent default -->
<a (click.prevent)="handle()">Link</a>

<!-- Key modifier: enter is Angular's built-in key name -->
<input (keyup.enter)="handle()" />

<!-- Mouse button modifier -->
<button (click.right)="handle()">Right click</button>

<!-- Combined modifiers: shift and self are conditional modifiers -->
<button (click.shift.self)="handle()">Shift+Click and target equals current element</button>
```

### Supported Modifiers

| Modifier  | Description                                                               |
| --------- | ------------------------------------------------------------------------- |
| `stop`    | Calls `event.stopPropagation()`, stops event propagation                  |
| `prevent` | Calls `event.preventDefault()`, prevents default behavior                 |
| `once`    | Listener fires only once then automatically removed                       |
| `capture` | Triggers listener in the capture phase                                    |
| `passive` | Marks as passive listener (improves scroll performance)                   |
| `self`    | Only triggers when event target equals the current element                |
| `control` | Requires Ctrl key to be pressed                                           |
| `shift`   | Requires Shift key to be pressed                                          |
| `alt`     | Requires Alt key to be pressed                                            |
| `meta`    | Requires Meta key (Win/Command) to be pressed                             |
| `left`    | Only respond to left mouse button click                                   |
| `right`   | Only respond to right mouse button click                                  |
| `middle`  | Only respond to middle mouse button click                                 |
| `exact`   | Only the specified system modifier keys (ctrl/shift/alt/meta) are pressed |

> **Note**: `stop`, `prevent`, `capture`, `once`, `passive` are built-in modifiers that are automatically removed from the event name and perform corresponding actions; other modifiers (such as `control`, `shift`, `alt`, `meta`, `self`, `left`, `right`, `middle`, `exact`) are conditional modifiers, and the callback is only triggered when the condition is met.

### Custom Modifiers

You can register custom modifiers by providing `EVENT_MODIFIER_OPTIONS`:

- **map**: Transforms event data, receives `(input: any, modifiers: string[]) => any`
- **guard**: Guard function, returns `boolean | Promise<boolean>`, `true` prevents the callback execution

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
    componentOutput: true, // Enable @Output() support on components
  },
}
```

### Usage

Register in `bootstrapApplication`:

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

### Full Demo

```html
<!-- stop + once: first click on child button handled by child, then listener removed, subsequent clicks bubble to parent -->
<div (click)="log('parent')">
  <button (click.stop.once)="log('child')">Click once</button>
</div>

<!-- Custom modifier: uppercase transforms event data to uppercase (must be configured in EVENT_MODIFIER_OPTIONS.map) -->
<app-a (output2.prefix.uppercase)="handle($event)"></app-a>

<!-- Delayed trigger (requires delay configured in EVENT_MODIFIER_OPTIONS.guard) -->
<button (click.delay)="log('delayed')">Delayed button</button>

<!-- Enable/disable toggle (requires enable/disable configured in EVENT_MODIFIER_OPTIONS.guard) -->
<button (click.enable)="log('enabled')">Allow click</button>
<button (click.disable)="log('disabled')">Block click</button>

<!-- Combined modifiers: control and shift must both be pressed to trigger -->
<input (keydown.control.shift)="handle()" />

<!-- Right mouse button -->
<button (mousedown.right)="handle()">Right-click only</button>

<!-- self: only triggers when clicking the element itself (not child elements) -->
<div (click.self)="log('direct click')">
  Click me or my child
  <span>I am a child element</span>
</div>
```

### Binding Component Outputs

After enabling `componentOutput: true`, you can modify the component's `@Output()`:

```html
<app-child (myOutput.stop.once)="handle($event)"></app-child>
```

---

## 3. Pipes EnumPipe & PurePipe

### 3.1 EnumPipe — Enum Value Mapping

#### Description

Maps enum values (numbers or strings) to readable text labels. Supports both `Map` and `Record` data structures.

#### Usage

```html
<!-- Basic usage: Map -->
<p>{{ status | enum : statusMap }}</p>

<!-- With default value -->
<p>{{ status | enum : statusMap : 'Unknown' }}</p>

<!-- Record / object -->
<p>{{ color | enum : { R: 'Red', G: 'Green', B: 'Blue' } }}</p>
```

```typescript
import { EnumPipe } from '@cyia/ngx-common/pipe';

export enum Status {
  Pending = 0,
  Active = 1,
  Inactive = 2,
}

const statusMap = new Map([
  [Status.Pending, 'Pending'],
  [Status.Active, 'In Progress'],
  [Status.Inactive, 'Closed'],
]);

// Or using object
const colorMap = { R: 'Red', G: 'Green', B: 'Blue' };
```

---

### 3.2 PurePipe — Pure Function Pipe

#### Description

Uses any function as a pure pipe. Angular's pure pipes skip execution when input references haven't changed; this pipe allows you to **apply the same caching behavior to any synchronous function**.

Useful to avoid re-executing complex computation functions called directly in templates on every change detection cycle.

#### Usage

```html
<!-- Basic usage: left side is the function, right side parameters are passed to the function sequentially -->
<p>{{ filterFn | pure : items }}</p>

<!-- Multiple parameters -->
<p>{{ combine | pure : value : arg1 : arg2 }}</p>

<!-- Using with signals -->
<p>{{ formatNumber | pure : value$() }}</p>
```

```typescript
import { PurePipe } from '@cyia/ngx-common/pipe';

@Component({
  template: `
    <!-- Filtered list (recalculated only when items reference changes) -->
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
    // This function is cached by PurePipe, re-executing only when items reference changes
    return items.filter((i) => i.name.startsWith('A'));
  }
}
```

---

## 4. Selectorless Tagless Rendering DomRendererFactory2

### Description

This is a **custom RendererFactory2** with the core capability to **"hide" the tag of Angular components matching specified selectors in the DOM**. In other words, if your component `<my-comp>` is added to the exclusion list, the rendered DOM will not include the `<my-comp></my-comp>` tag, instead directly displaying the component's inner child elements.

> **Relationship with SelectorlessOutlet**: Both aim to achieve a "tagless" effect, but in different ways — `SelectorlessOutlet` dynamically creates components via a directive; whereas `DomRendererFactory2` intercepts `createElement` at the rendering level, replaces components matching selectors with a proxy node (ProxyNode), and transparently flattens their subtrees in the DOM.

### How It Works

1. Register the list of selectors to exclude.
2. Set the custom `DomRendererFactory2` to replace the default RendererFactory.
3. During Angular rendering, when encountering a registered component selector, a `ProxyNode` is created instead of a real DOM element.
4. `ProxyNode` inserts the component's child nodes directly into the parent container, achieving tag transparency.

### Usage

#### Registering Excluded Selectors

```typescript
import { selectorlessExcludeTag, setSelectorlessFilter } from '@cyia/ngx-common/service';

// Method 1: Add individually
selectorlessExcludeTag('my-comp');
selectorlessExcludeTag('user-card');

// Method 2: Batch set filter (recommended)
// Exclude all selectors starting with 'app-'
setSelectorlessFilter((name) => name.startsWith('app-'));
```

#### Register in `bootstrapApplication`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { DomRendererFactory2 } from '@cyia/ngx-common/service';

bootstrapApplication(AppComponent, {
  providers: [DomRendererFactory2, { provide: RendererFactory2, useExisting: DomRendererFactory2 }],
});
```

#### Normal Component Implementation

- Do not use `styles`/`styleUrl` in the component (place them globally).
