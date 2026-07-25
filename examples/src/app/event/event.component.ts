import { Component, signal } from '@angular/core';
import { AComponent } from './a.component';

interface LogEntry {
  time: string;
  message: string;
}

@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  standalone: true,
  imports: [AComponent],
})
export class EventComponent {
  // ① stop + once：子级按钮触发一次后移除监听，之后点击都由父级捕获
  clickLog = signal<LogEntry[]>([]);

  // ② 自定义事件 & 修饰符
  outputLog = signal<LogEntry[]>([]);

  // ③ 延迟触发
  delayLog = signal<LogEntry[]>([]);

  // ④ enable / disable
  enableDisableLog = signal<LogEntry[]>([]);

  clicked(target: string, msg: string): void {
    const entry: LogEntry = { time: new Date().toLocaleTimeString(), message: msg };
    switch (target) {
      case 'click':
        this.clickLog.update((arr) => [...arr.slice(-9), entry]);
        break;
      case 'delay':
        this.delayLog.update((arr) => [...arr.slice(-9), entry]);
        break;
      case 'enableDisable':
        this.enableDisableLog.update((arr) => [...arr.slice(-9), entry]);
        break;
    }
  }

  output(msg: unknown): void {
    this.outputLog.update((arr) => [...arr.slice(-9), { time: new Date().toLocaleTimeString(), message: String(msg) }]);
  }
}
