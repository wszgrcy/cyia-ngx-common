import {
  ApplicationRef,
  ComponentRef,
  computed,
  createComponent,
  Directive,
  EnvironmentInjector,
  inject,
  Injector,
  input,
  Input,
  inputBinding,
  isSignal,
  outputBinding,
  signal,
  Signal,
  SimpleChange,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[selectlessOutlet]',
  exportAs: 'selectlessOutlet',
})
export class SelectorlessOutlet<T = any> {
  selectlessOutlet = input.required<Type<T>>();

  selectlessOutletInputs = input<Record<string, () => unknown>>();
  selectlessOutletOutputs = input<Record<string, (event: any) => unknown>>();

  selectlessOutletDirectives = input<
    {
      type: Type<T>;
      inputs: Record<string, () => unknown>;
      outputs: Record<string, (event: any) => unknown>;
    }[]
  >();

  selectlessOutletInjector = input<Injector>();
  selectlessOutletEnvironmentInjector = input<EnvironmentInjector>();

  #environmentInjector = inject(EnvironmentInjector);
  #injector = inject(Injector);
  #viewContainerRef = inject(ViewContainerRef);
  #appRef = inject(ApplicationRef);
  private _componentRef: ComponentRef<T> | undefined;

  get componentInstance(): T | null {
    return this._componentRef?.instance ?? null;
  }

  private _needToReCreateComponentInstance(changes: Record<keyof SelectorlessOutlet, SimpleChange>): boolean {
    return (
      changes.selectlessOutlet !== undefined ||
      changes.selectlessOutletInputs !== undefined ||
      changes.selectlessOutletOutputs !== undefined ||
      changes.selectlessOutletInjector !== undefined ||
      changes.selectlessOutletEnvironmentInjector !== undefined
    );
  }

  signalInput$ = computed(() => {
    let inputs = this.selectlessOutletInputs() ?? {};
    let obj: Record<string, Signal<any>> = {};
    for (const key in inputs) {
      const data = inputs[key];
      if (isSignal(data)) {
        obj[key] = data;
      } else {
        obj[key] = signal(data);
      }
    }
    return obj;
  });
  ngOnChanges(changes: Record<keyof SelectorlessOutlet, SimpleChange>) {
    if (this._needToReCreateComponentInstance(changes)) {
      this.dispose();
      if (this.selectlessOutlet) {
        const injector = this.selectlessOutletInjector() || this.#injector;
        const inputs = this.signalInput$();

        const outputs = this.selectlessOutletOutputs() ?? {};
        this._componentRef = createComponent(this.selectlessOutlet(), {
          elementInjector: injector,
          environmentInjector: this.selectlessOutletEnvironmentInjector() ?? this.#environmentInjector,
          bindings: [
            ...Object.keys(inputs).map((key) => {
              return inputBinding(key, inputs[key]);
            }),
            ...Object.keys(outputs).map((key) => {
              return outputBinding(key, outputs[key]);
            }),
          ],
          directives: (this.selectlessOutletDirectives() ?? []).map((item) => {
            const inputs = item.inputs ?? {};
            const outputs = item.outputs ?? {};
            return {
              type: item.type,
              bindings: [
                ...Object.keys(inputs).map((key) => {
                  return inputBinding(key, inputs[key]);
                }),
                ...Object.keys(outputs).map((key) => {
                  return outputBinding(key, outputs[key]);
                }),
              ],
            };
          }),
        });

        const instance = this._componentRef.instance as {
          templateRef: Signal<TemplateRef<any>>;
        };
        this.#viewContainerRef.createEmbeddedView(instance.templateRef());
        this.#appRef.attachView(this._componentRef.hostView);
        this._componentRef.changeDetectorRef.detectChanges();
      }
    }
  }
  dispose() {
    this.#viewContainerRef.clear();
    this._componentRef?.destroy();
    this._componentRef = undefined;
  }
  ngOnDestroy(): void {
    this.dispose();
  }
}
