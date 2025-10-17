import { Component, effect, OnInit, signal } from '@angular/core';
import { SelectorlessOutlet } from '@cyia/ngx-common/directive';
import { InsertComponent } from './insert-comp/component';

@Component({
  selector: 'selectorless',
  templateUrl: './component.html',
  imports: [SelectorlessOutlet],
})
export class SelectorlessExampleComponent implements OnInit {
  InsertComponent = InsertComponent;
  index$ = signal(0);
  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.index$.update((a) => a + 1);
    }, 1000);
  }
}
