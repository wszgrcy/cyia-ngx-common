import { Type } from '@angular/core';
import { EventComponent } from './event/event.component';
import { SelectorlessExampleComponent } from './selectorless/component';

export const EXAMPLE_GROUP: {
  [name: string]: {
    component: Type<any>;
    module?: Type<any>;
  };
} = {
  event: {
    component: EventComponent,
  },
  selectorless: {
    component: SelectorlessExampleComponent,
  },
};
