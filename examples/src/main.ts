import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Observable } from 'rxjs';

if (environment.production) {
  enableProdMode();
}

(window as any).cyiaNgxDocsLoadExamples = platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
  .then((ref: NgModuleRef<AppModule>) => {
    return (selector: string, element: HTMLElement, destroy$: Observable<void>) => {
      return ref.instance.loadExample(selector as any, element, destroy$);
    };
  });
