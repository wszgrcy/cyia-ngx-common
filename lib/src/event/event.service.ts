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
  guard?: Record<string, (input: any, modifiers: string[]) => boolean | Promise<boolean>>;
};
export interface EventModifierOptions {
  modifiers?: EventModifiers;
  /** 支持组件output */
  componentOutput?: boolean;
}
export const EVENT_MODIFIER_OPTIONS = new InjectionToken<EventModifierOptions>('EVENT_MODIFIER_OPTIONS');

const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];

type KeyedEvent = KeyboardEvent | MouseEvent | TouchEvent;

const modifierGuards: Record<string, (e: Event, modifiers: string[]) => boolean> = {
  stop: (e) => e.stopPropagation() as unknown as false,
  prevent: (e) => e.preventDefault() as unknown as false,
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
type Data = any;
const DISABLED = Symbol('DISABLED');
function withModifiers<T extends (event: any) => any>(fn: T, modifiers: string[], customEventModifier: EventModifiers) {
  return ((data, ...args) => {
    const modifierFn = (item: string, data: Data) => {
      if (item === 'once') {
        return data;
      }
      const guard = customEventModifier?.guard?.[item] ?? modifierGuards[item];
      if (guard) {
        let disabled = guard(data, modifiers);
        if (disabled instanceof Promise) {
          return disabled.then((disabled) => {
            return disabled ? DISABLED : data;
          });
        }
        return disabled ? DISABLED : data;
      } else {
        let mapItem = customEventModifier?.map?.[item];
        if (!mapItem) {
          throw new Error(`unknown modifier: ${item}`);
        }
        return mapItem(data, modifiers);
      }
    };
    for (const item of modifiers) {
      if (data instanceof Promise) {
        data = data.then((value) => {
          if (value === DISABLED) {
            return value;
          }
          return modifierFn(item, value);
        });
      } else {
        data = modifierFn(item, data);
        if (data === DISABLED) {
          return;
        }
      }
    }
    if (data instanceof Promise) {
      return data.then((value) => {
        if (value === DISABLED) {
          return;
        }
        return fn(value, ...args);
      });
    } else {
      return fn(data, ...args);
    }
  }) as T;
}
function getModifierStatusAndRemove(list: string[], item: string) {
  let index = list.indexOf(item);
  if (index === -1) {
    return false;
  }
  list.splice(index, 1);
  return true;
}
const HOOKED_EVENT = Symbol('HOOKED_EVENT');
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
    if (this.#options.componentOutput && typeof (element as any)['__ngContext__'] !== undefined) {
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
            let newEvent: EventEmitter<any> = maybeComponent[propertyName][HOOKED_EVENT] ?? new EventEmitter(false);
            maybeComponent[propertyName][HOOKED_EVENT] = newEvent;
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
