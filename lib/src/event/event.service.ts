import { ElementRef, Inject, Injectable, inject, ɵComponentDef } from '@angular/core';
import { EventManagerPlugin, ɵKeyEventsPlugin } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
const PRIVATE_EVENT_LIST = Symbol('PRIVATE_EVENT_LIST');
export function injectEventModifier(instance: any) {
  let dir = Object.getPrototypeOf(instance).constructor['ɵcmp'] as ɵComponentDef<any>;
  let el = inject(ElementRef).nativeElement as HTMLElement;
  let list = Object.keys(dir.outputs);
  if (!list.length) {
    return;
  }
  (el as any)[PRIVATE_EVENT_LIST] = list;
  for (const eventName in dir.outputs) {
    const propertyName = dir.outputs[eventName];
    instance[propertyName].next = instance[propertyName].emit = function (value: any) {
      let event = new CustomEvent(eventName, { detail: value });
      el.dispatchEvent(event);
    };
  }
}
const systemModifiers = ['control', 'shift', 'alt', 'meta'];

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

const withModifiers = <T extends (event: Event) => any>(
  fn: T & { _withMods?: { [key: string]: T } },
  modifiers: string[]
) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join('.');
  return (
    cache[cacheKey] ||
    (cache[cacheKey] = ((event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers)) return;
      }
      return fn(event, ...args);
    }) as T)
  );
};
function getModifierStatusAndRemove(list: string[], item: string) {
  let index = list.indexOf(item);
  if (index === -1) {
    return false;
  }
  list.splice(index, 1);
  return true;
}

@Injectable()
export class ModifierEventsPlugin extends EventManagerPlugin {
  constructor(@Inject(DOCUMENT) doc: any) {
    super(doc);
  }
  supports(eventName: string): boolean {
    return true;
  }
  addEventListener(element: HTMLElement, eventName: string, handler: (event: Event) => any): Function {
    let list = eventName.split('.');
    let name = list.shift()!;
    let newHandler = withModifiers(handler, list.slice());
    list = list.filter((item) => !RemoveModifiers.includes(item));
    if (((element as any)[PRIVATE_EVENT_LIST] as string[])?.includes(name)) {
      let fn = (event: any) => newHandler(event.detail);
      element.addEventListener(name, fn, {
        once: getModifierStatusAndRemove(list, 'once'),
      });
      return () => this.#removeEventListener(element, eventName, fn as EventListener);
    } else {
      let options: AddEventListenerOptions = {
        capture: getModifierStatusAndRemove(list, 'capture'),
        once: getModifierStatusAndRemove(list, 'once'),
        passive: getModifierStatusAndRemove(list, 'passive'),
      };
      let newEventName = [name, ...list].join('.');
      let parsedEvent = ɵKeyEventsPlugin.parseEventName(newEventName);
      if (!parsedEvent) {
        return this.#commonEvent(element, name, newHandler, options);
      } else {
        return this.#keyBoardEvent(element, parsedEvent, newHandler, options);
      }
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
