import { Type } from '@angular/core';
import { EventComponent } from './event/event.component';

export const EXAMPLE_GROUP: {
  [name: string]: {
    component: Type<any>;
    module?: Type<any>;
  };
} = {
  event: {
    component: EventComponent,
  },
};
