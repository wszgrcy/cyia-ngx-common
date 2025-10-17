import {
  Component,
  ComponentRef,
  ElementRef,
  ViewContainerRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injector,
  ApplicationRef,
} from '@angular/core';
import { EXAMPLE_GROUP } from './example-group';
import { environment } from '../environments/environment';
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  subject = new Subject<void>();
  injector = inject(Injector);
  applicationRef = inject(ApplicationRef);
  constructor(private viewContainerRef: ViewContainerRef, private elementRef: ElementRef<HTMLElement>) {}
  ngOnInit(): void {
    if (!environment.production) {
      this.loadExampleComponent();
    }
  }

  loadExample(selector: keyof typeof EXAMPLE_GROUP, element: HTMLElement, destroy$: Observable<void>) {
    const item = EXAMPLE_GROUP[selector];

    let ref = createComponent(item.component, { environmentInjector: this.injector.get(EnvironmentInjector) });

    this.applicationRef.attachView(ref.hostView);
    element.appendChild(ref.location.nativeElement);
    ref.changeDetectorRef.detectChanges();
    destroy$.pipe(take(1)).subscribe(() => {
      ref.destroy();
    });
    return ref;
  }
  async loadExampleComponent() {
    for (let i = 0; i < Object.keys(EXAMPLE_GROUP).length; i++) {
      const element = document.createElement('div');
      const selector = Object.keys(EXAMPLE_GROUP)[i];
      const componentRef: ComponentRef<any> = this.loadExample(selector, element, this.subject.asObservable());
      // this.viewContainerRef.insert(componentRef.hostView);
      this.elementRef.nativeElement.appendChild(element);
    }
  }
}
