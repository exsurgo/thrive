import {html, LitElement, property, PropertyValues, TemplateResult} from 'lit-element';
import {render} from 'lit-html';

import {isElement, isWindow} from '../libs/utils';

const DEFAULT_DEBOUNCE = 10;
const SHARED_STYLES = html`<link rel="stylesheet" href="/styles.css">`;

export class AppElement extends LitElement {
  @property({type: Boolean, reflect: true}) hidden: boolean = false;

  /** @export Allows styles to be expressed as a style template result. */
  static css: TemplateResult;

  render(): TemplateResult | string | undefined {
    return html`<slot></slot>`;
  }

  protected update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    this.addStyles();
  }

  /** Call init method after first update. */
  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.init();
  }

  private stylesAdded = false;

  /** Add default styles to shadow root automatically. */
  private addStyles() {
    if (!this.stylesAdded && this.shadowRoot &&
        this.shadowRoot.hasChildNodes()) {
      const temp = document.createElement('template');

      // The browser de-duplicates links/styles added to the shadow root
      // so this method of sharing common styles should be efficient

      // Add element CSS
      // tslint:disable:no-any
      const cntr: any = (this as any).constructor;
      if (cntr.css) {
        render(cntr.css as TemplateResult, temp);
        for (let i = temp.children.length - 1; i >= 0; i--) {
          const child = temp.children[i];
          this.shadowRoot.prepend(child);
        }
      }

      // Add shared styles
      render(SHARED_STYLES, temp);
      this.shadowRoot.prepend(temp.children[0]);

      this.stylesAdded = true;
    }
  }

  /** Initializes the element. */
  protected init() {}

  /* Events */

  /** Facilitates easy removal of listeners via `unlisten`. */
  protected eventListeners: AppEventListener[] = [];

  /**
   * Adds an event listener to the current element.
   * @example
   * this.listen('my-event', handler);
   */
  listen(event: string, callback: Function): void;

  /**
   * Adds multiple event listeners to the current element.
   * @example
   * this.listen(['my-event1', 'my-event2'], handler);
   */
  listen(events: string[], callback: Function): void;

  /**
   * Adds an event listener to an external element or window.
   * @example
   * this.listen(element, 'my-event', handler);
   */
  listen(el: EventTarget, event: string, callback: Function): void;

  /**
   * Adds multiple event listeners to an external element or window.
   * @example
   * this.listen(element, ['my-event1', 'my-event2'], handler);
   */
  listen(el: EventTarget, events: string[], callback: Function): void;

  /**
   * Adds multiple event listeners, via a map of event names to callbacks.
   * @example
   * this.listen({
   *   'my-event1': handler,
   *   'my-event2': handler2
   * });
   */
  listen(eventMap: {[key: string]: Function}): void;

  /**
   * An overloaded shortcut method for adding event listeners. One or more
   * listeners can be added to the current element, or external elements.
   * Listeners are tracked, and can be removed via `unlisten`. All listeners
   * are removed if `remove` is called.  The context `this` of these methods
   * callbacks are always the current instance of the element.
   *
   * The listeners are also automatically attached to both the root and shadow
   * root, since events for shadow elements are not automatically propagated.
   */
  listen(
      p1: string|string[]|EventTarget|AppEventMap,
      p2?: string|string[]|Function, p3?: Function): void {
    // String event, callback
    if (typeof p1 === 'string') {
      const event = p1;
      const handler = p2 as Function;
      const callback = (e: Event) => {
        handler.call(this, e);
      };
      this.addEventListener(event, callback);
      if (this.shadowRoot) {
        this.shadowRoot.addEventListener(event, callback);
      }
      this.checkDuplicateListeners(event, handler);
      this.eventListeners.push({element: this, event, callback, handler});
    }

    // Array of events, callback
    else if (Array.isArray(p1)) {
      const events = p1;
      const handler = p2 as Function;
      for (const event of events) {
        const callback = (e: Event) => {
          handler.call(this, e);
        };
        this.addEventListener(event, callback);
        if (this.shadowRoot) {
          this.shadowRoot.addEventListener(event, callback);
        }
        this.checkDuplicateListeners(event, handler);
        this.eventListeners.push({element: this, event, callback, handler});
      }
    }

    // EventTarget, string|string[], callback
    else if (isElement(p1) || isWindow(p1) || p1 instanceof HTMLDocument) {
      const element = p1 as Element;
      const events = Array.isArray(p2) ? p2 : [p2] as string[];
      const handler = p3 as Function;
      for (const event of events) {
        const callback = (e: Event) => {
          handler.call(this, e);
        };
        element.addEventListener(event, callback);
        if (element.shadowRoot) {
          element.shadowRoot.addEventListener(event, callback);
        }
        this.checkDuplicateListeners(event, handler);
        this.eventListeners.push({element, event, callback, handler});
      }
    }

    // EventMap of events/callbacks
    else {
      for (const event in p1) {
        if (p1.hasOwnProperty(event)) {
          const handler = (p1 as AppEventMap)[event];
          const callback = (e: Event) => {
            handler.call(this, e);
          };
          this.addEventListener(event, callback);
          if (this.shadowRoot) {
            this.shadowRoot.addEventListener(event, callback);
          }
          this.checkDuplicateListeners(event, handler);
          this.eventListeners.push({element: this, event, callback, handler});
        }
      }
    }
  }

  /** Check for possible duplication of event handlers being added. */
  private checkDuplicateListeners(event: string, handler: Function) {
    if (location.hostname === 'localhost') {
      for (const listener of this.eventListeners) {
        if (listener.handler && listener.event === event &&
            listener.handler === handler) {
          console.warn(
              'Possible duplicate event listeners in ' + this.constructor.name);
        }
      }
    }
  }

  /** Removes all listeners for a certain event. */
  unlisten(event?: string) {
    // Remove listeners by event name
    if (event) {
      for (let i = 0; i < this.eventListeners.length; i++) {
        const listener = this.eventListeners[i];
        if (listener.event === event) {
          listener.element!.removeEventListener(
              event, listener.callback as EventListener);
          if (listener.element!.shadowRoot) {
            listener.element!.shadowRoot.removeEventListener(
                event, listener.callback as EventListener);
          }
          this.eventListeners.splice(i, 1);
        }
      }
      this.eventListeners = this.eventListeners.filter(o => o.event !== event);
    } else {
      // Remove all listeners
      for (const listener of this.eventListeners) {
        listener.element!.removeEventListener(
            listener.event, listener.callback as EventListener);
        if (listener.element!.shadowRoot) {
          listener.element!.shadowRoot.removeEventListener(
              listener.event, listener.callback as EventListener);
        }
      }
      // Reset length rather than re-assign, since may be referenced
      // elsewhere.  This is a performant and cross-browser compatible.
      this.eventListeners.length = 0;
    }
  }

  /**
   * Fires a custom event.
   * @param name - Name of event
   */
  fire(name: string): void;

  /**
   * Fires a custom event for the current element.
   * @param name - Name of event
   * @param event - An event object to be cloned and re-dispatched.
   */
  fire(name: string, event: Event): void;

  /**
   * Fires a custom event for the current element.
   * @param name - Name of event
   * @param detail - The `detail` object to add to custom event.
   */
  fire(name: string, detail: {}): void;

  /** Fires a custom event for the current element. */
  fire(name: string, eventOrDetail?: Event|{}): void {
    const init: {[key: string]: unknown} = {
      bubbles: true,
      cancelable: true,
      detail: {},
    };

    if (eventOrDetail) {
      if (eventOrDetail instanceof Event) {
        const cntr = eventOrDetail.constructor;
        // Clone the event to re-dispatch it
        // tslint:disable:no-any - Need to disable signature error
        const clone = new (cntr as any)(name, eventOrDetail);
        this.dispatchEvent(clone);
      } else {
        init['detail'] = eventOrDetail;
        this.dispatchEvent(new CustomEvent(name, init));
      }
    } else {
      this.dispatchEvent(new CustomEvent(name, init));
    }
  }

  /** @override Remove all event listeners when element is removed. */
  remove() {
    super.remove();
    // Remove all listeners
    this.unlisten();
  }

  /**
   * Removes all elements in a container.
   * @param container - An element to empty. Defaults to this element.
   */
  empty(container: Element = this) {
    for (const el of Array.from(container.children)) {
      el.remove();
    }
  }

  /* Hide/Show */

  /** Make the element visible via the [hidden] attribute. */
  show() {
    if (this.hidden) {
      this.hidden = false;
      if (this.onShow) {
        this.onShow();
      }
    }
  }

  /** Callback for element being shown. */
  protected onShow?() {}

  /** Make the element hidden. */
  hide() {
    if (!this.hidden) {
      this.hidden = true;
      if (this.onHide) {
        this.onHide();
      }
    }
  }

  /** Callback for element being hidden. */
  protected onHide?() {}


  /* Utils */

  /**
   * Search for child/descendant elements within this element.  By default,
   * the shadow DOM is queried, but the light DOM can be queried as well.
   * @param selector - A selector to query with.
   * @param lightDom - Query the light DOM rather than shadow DOM.
   */
  query<T extends Element>(selector: string, lightDom = false): Array<T> {
    const root = lightDom ? this : this.shadowRoot!;
    return Array.from(root.querySelectorAll(selector));
  }

  /** Returns a corresponding record for an event target. */
  getModel<T>(e: Event, array: T[]): T {
    const el = (e.target as HTMLElement);
    const index = Array.from(el.parentElement!.children).indexOf(el);
    return array[index];
  }

  private debouncers?: Set<Function>;

  /**
   * Limits a function to a single call within a certain amount of time.
   * Implemented here rather than a util, since it is heavily used in views.
   * @param time - Time in milliseconds
   * @param callback - Function to be executed
   */
  debounce(callback: Function, time = DEFAULT_DEBOUNCE) {
    // Use private map for state
    if (!this.debouncers) {
      this.debouncers = new Set();
    }
    // Function was just called, exit
    if (this.debouncers.has(callback)) return;
    // Otherwise run the function, and start a timeout
    this.debouncers.add(callback);
    callback();
    setTimeout(() => {
      this.debouncers!.delete(callback);
    }, time);
  }
}

/** A map of event names and callbacks. */
export interface AppEventMap {
  [key: string]: Function;
}

/** Represents an event listener added by the `listen` method. */
export interface AppEventListener {
  /** The name of the event. */
  event: string;
  /** The callback to be ran. */
  callback: Function;
  /** The unwrapped handler function. */
  handler?: Function;
  /** The element which the event is attached to. */
  element?: Element;
  /** The event target to locate after when element is connected. */
  target?: string|EventTarget;
  /** Indicates listener is only declared, by not yet attached. */
  declared?: boolean;
}
