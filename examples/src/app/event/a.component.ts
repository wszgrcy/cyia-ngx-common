import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { injectEventModifier } from '@cyia/ngx-common/event';
// 用于测试动态组件
@Component({
  selector: 'app-a',
  template: `test`,
  host: { class: 'inside', style: 'color:red' },
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AComponent implements OnInit {
  @Output() output2 = new EventEmitter();
  constructor() {
    injectEventModifier(this);
    setTimeout(() => {
      this.output2.emit('测试');
      setTimeout(() => {
        this.output2.emit('测试2');
      }, 1000);
    }, 0);
  }

  ngOnInit(): void {}
}
