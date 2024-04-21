import {
  EventEmitter,
  Inject,
  Injectable,
  InjectionToken,
  inject,
  reflectComponentType,
  ɵgetLContext,
} from '@angular/core';
import { EventManagerPlugin, ɵKeyEventsPlugin } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Observable, first } from 'rxjs';
type EventModifiers = {
  map?: Record<string, (input: any, modifiers: string[]) => any>;
  guard?: Record<string, (input: any, modifiers: string[]) => any>;
};
export interface EventModifierOptions {
  modifiers?: EventModifiers;
  componentOutput?: boolean;
}
export const EVENT_MODIFIER_OPTIONS = new InjectionToken<EventModifierOptions>('EVENT_MODIFIER_OPTIONS');

const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];

type KeyedEvent = KeyboardEvent | MouseEvent | TouchEvent;

const modifierGuards: Record<string, (e: Event, modifiers: string[]) => void | boolean> = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  control: (e) => !(e as KeyedEvent).ctrlKey,
  shift: (e) => !(e as KeyedEvent).shiftKey,
  alt: (e) => !(e as KeyedEvent).altKey,
  meta: (e) => !(e as KeyedEvent).metaKey,
  left: (e) => 'button' in e && (e as MouseEvent).button !== 0,
  middle: (e) => 'button' in e && (e as MouseEvent).button !== 1,
  right: (e) => 'button' in e && (e as MouseEvent).button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => (e as any)[`${m}Key`] && !modifiers.includes(m)),
};
const RemoveModifiers = ['stop', 'prevent', 'self', 'left', 'middle', 'right', 'exact'];

function withModifiers<T extends (event: Event) => any>(
  fn: T & { _withMods?: { [key: string]: T } },
  modifiers: string[],
  customEventModifier: EventModifiers
) {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join('.');
  return (
    cache[cacheKey] ||
    (cache[cacheKey] = ((event, ...args) => {
      for (const item of modifiers) {
        if (item === 'once') {
          continue;
        }
        const guard = customEventModifier?.guard?.[item] ?? modifierGuards[item];
        if (guard) {
          if (guard(event, modifiers)) {
            return;
          }
        } else {
          let mapItem = customEventModifier?.map?.[item];
          if (!mapItem) {
            throw new Error(`unknown modifier: ${item}`);
          }
          event = mapItem(event, modifiers);
        }
      }

      return fn(event, ...args);
    }) as T)
  );
}
function getModifierStatusAndRemove(list: string[], item: string) {
  let index = list.indexOf(item);
  if (index === -1) {
    return false;
  }
  list.splice(index, 1);
  return true;
}

@Injectable()
export class EventModifiersPlugin extends EventManagerPlugin {
  #options = inject(EVENT_MODIFIER_OPTIONS, { optional: true }) ?? {};
  constructor(@Inject(DOCUMENT) doc: any) {
    super(doc);
  }
  supports(eventName: string): boolean {
    return true;
  }
  addEventListener(element: HTMLElement, eventName: string, handler: (event: Event) => any): Function {
    let modifierList = eventName.split('.');
    let name = modifierList.shift()!;
    let newHandler = withModifiers(handler, modifierList.slice(), this.#options.modifiers);
    // 1.找组件,找不到正常.2.找到组件但是没有output正常(component click)
    modifierList = modifierList.filter((item) => !RemoveModifiers.includes(item));
    if (this.#options.componentOutput && typeof (element as any)['__ngContext__'] === 'number' && eventName !== name) {
      let lContext = ɵgetLContext(element);
      let maybeComponent = lContext?.lView?.[lContext.nodeIndex]?.[8];
      if (maybeComponent) {
        let define = reflectComponentType(maybeComponent.constructor)!;
        let list = define.outputs;
        if (list.length) {
          let item = list.find((item) => item.templateName === name);
          let outputP = maybeComponent[item.propName];
          if (outputP) {
            const propertyName = item.propName;
            let newEvent = new EventEmitter(false);
            let ob = newEvent as Observable<any>;
            if (getModifierStatusAndRemove(modifierList, 'once')) {
              ob = ob.pipe(first());
            }
            let subscription = ob.subscribe((value) => {
              newHandler(value);
            });

            maybeComponent[propertyName].emit = function (value: any) {
              newEvent.next(value);
            };
            return () => subscription.unsubscribe();
          }
        }
      }
    }

    let options: AddEventListenerOptions = {
      capture: getModifierStatusAndRemove(modifierList, 'capture'),
      once: getModifierStatusAndRemove(modifierList, 'once'),
      passive: getModifierStatusAndRemove(modifierList, 'passive'),
    };
    let newEventName = [name, ...modifierList].join('.');
    let parsedEvent = ɵKeyEventsPlugin.parseEventName(newEventName);
    if (!parsedEvent) {
      return this.#commonEvent(element, name, newHandler, options);
    } else {
      return this.#keyBoardEvent(element, parsedEvent, newHandler, options);
    }
  }

  #commonEvent(element: HTMLElement, eventName: string, handler: Function, options: AddEventListenerOptions) {
    element.addEventListener(eventName, handler as EventListener, options);
    return () => this.#removeEventListener(element, eventName, handler as EventListener);
  }
  #keyBoardEvent(
    element: HTMLElement,
    parsedEvent: {
      fullKey: string;
      domEventName: string;
    },
    handler: Function,
    options: AddEventListenerOptions
  ): Function {
    const outsideHandler = ɵKeyEventsPlugin.eventCallback(parsedEvent['fullKey'], handler, this.manager.getZone());

    return this.manager.getZone().runOutsideAngular(() => {
      element.addEventListener(parsedEvent['domEventName'] as any, outsideHandler as any, options);
      return () => {
        this.#removeEventListener(element, parsedEvent['domEventName'] as any, outsideHandler as any);
      };
    });
  }
  #removeEventListener(target: any, eventName: string, callback: Function): void {
    return target.removeEventListener(eventName, callback as EventListener);
  }
}
