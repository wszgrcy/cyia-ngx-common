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
  WritableSignal,
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

  #inputValue$ = signal<Record<string, WritableSignal<any>>>({});
  #inputKey$$ = computed(() => {
    return Object.keys(this.#inputValue$()).sort();
  });

  ngOnChanges(changes: Record<keyof SelectorlessOutlet, SimpleChange>) {
    if (changes.selectlessOutletInputs) {
      let keyEqual = this.#inputKeyEqual(this.selectlessOutlet());
      this.#updateInput(this.selectlessOutletInputs());
      if (Object.keys(changes).length === 1 && keyEqual) {
        return;
      }
    }

    this.dispose();
    if (this.selectlessOutlet) {
      const injector = this.selectlessOutletInjector() || this.#injector;
      const inputs = this.#inputValue$();

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
  dispose() {
    this.#viewContainerRef.clear();
    this._componentRef?.destroy();
    this._componentRef = undefined;
  }
  ngOnDestroy(): void {
    this.dispose();
  }
  #updateInput(value: any) {
    this.#inputValue$.update((inputValue) => {
      for (const key in value) {
        const inputItem = value[key];
        inputValue[key] ??= signal(undefined);
        if (isSignal(inputItem)) {
          inputValue[key] = inputItem as any;
        } else {
          if (isSignal(inputValue[key]) && 'set' in inputValue[key]) {
            inputValue[key].set(inputItem);
          } else {
            inputValue[key] = signal(inputItem);
            throw new Error(`selectorless:${key}:Signal-> WritableSignal❌`);
          }
        }
      }
      return inputValue;
    });
  }
  #inputKeyEqual(newValue: any) {
    let list = Object.keys(newValue).sort();
    if (this.#inputKey$$().length !== list.length) {
      return false;
    }

    return this.#inputKey$$().every((item, i) => list[i] === item);
  }
}
