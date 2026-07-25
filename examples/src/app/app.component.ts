import { Component } from '@angular/core';
import { EventComponent } from './event/event.component';
import { SelectorlessExampleComponent } from './selectorless/component';
import { SelectorlessRendererExampleComponent } from './selectorless-renderer/component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [EventComponent, SelectorlessExampleComponent, SelectorlessRendererExampleComponent],
})
export class AppComponent {
  activeTab = 'event';
}
