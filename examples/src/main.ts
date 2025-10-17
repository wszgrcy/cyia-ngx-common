import { DOCUMENT, enableProdMode, NgModuleRef } from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { EVENT_MODIFIER_OPTIONS, EventModifierOptions, EventModifiersPlugin } from '@cyia/ngx-common/event';

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    EventModifiersPlugin,
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
            prefix: (value) => {
              return `prefix:${value}`;
            },
          },
          guard: {
            delay: (value) => {
              return new Promise((res) => {
                setTimeout(() => {
                  res(false);
                }, 1000);
              });
            },
            disable: (value) => {
              return true;
            },
            enable: (value) => {
              return false;
            },
          },
        },
        componentOutput: true,
      } as EventModifierOptions,
    },
  ],
});
