import { Component, ComponentRef, ElementRef, ViewContainerRef, DoBootstrap } from '@angular/core';
import { EXAMPLE_GROUP } from './example-group';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  subject = new Subject();
  constructor(private viewContainerRef: ViewContainerRef, private elementRef: ElementRef<HTMLElement>) {}
  ngOnInit(): void {
    if (!environment.production) {
      this.loadExampleComponent();
    }
  }
  async loadExampleComponent() {
    for (let i = 0; i < Object.keys(EXAMPLE_GROUP).length; i++) {
      const element = document.createElement('div');
      const selector = Object.keys(EXAMPLE_GROUP)[i];
      const fn: any = await (window as any).cyiaNgxDocsLoadExamples;
      const componentRef: ComponentRef<any> = fn(selector, element, this.subject);
      // this.viewContainerRef.insert(componentRef.hostView);
      this.elementRef.nativeElement.appendChild(element);
    }
  }
}
