import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadBaseComponent } from './lazy-load-base.component';
import { LazyLoadModule, createWebComponent } from '@cyia/ngx-common/lazy-load';

@NgModule({
  imports: [
    CommonModule,
    LazyLoadModule.forRoot([
      [
        'to-be-load',
        (injector, compiler) =>
          import('./to-be-load/to-be-load.module').then((e) =>
            createWebComponent(injector, compiler, e.ToBeLoadModule, 'to-be-load')
          ),
      ],
    ]),
  ],
  declarations: [LazyLoadBaseComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LazyLoadBaseModule {}
