import { Component } from '@angular/core';
import { EventComponent } from './event/event.component';
import { SelectorlessExampleComponent } from './selectorless/component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [EventComponent, SelectorlessExampleComponent],
})
export class AppComponent {
  activeTab = 'event';
}

