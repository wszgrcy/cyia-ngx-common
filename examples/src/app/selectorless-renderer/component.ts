/**
 * Selectorless Renderer 演示入口组件
 * 
 * 此组件作为 tab 导航中的展示页面,
 * 直接渲染 SelectorlessRendererDemoComponent
 */
import { Component } from '@angular/core';
import { SelectorlessRendererDemoComponent } from './selectorless-demo.component';

@Component({
  selector: 'selectorless-renderer',
  standalone: true,
  imports: [SelectorlessRendererDemoComponent],
  template: `<selectorless-renderer-demo></selectorless-renderer-demo>`,
})
export class SelectorlessRendererExampleComponent {}
