
export enum State {
  currentView = 'currentView',
  selectedStock = 'selectedStock',
}

export interface IState {
  currentView?: AppView;
  selectedStock?: string;
}

export enum AppView {
  dashboard = 'dashboard',
  analyze = 'analyze',
  search = 'search',
}

type StateHandler = (value: any, state: IState) => void;

const handlers: Map<State, StateHandler[]> = new Map();

export const state: IState = new Proxy<IState>({}, {
  get: function (target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    const functions = handlers.get(key as State);
    if (functions) {
      for (const func of functions) func(value, target);
    }
    return Reflect.set(target, key, value, receiver);
  }
});

export function onChange(key: State, callback: StateHandler) {
  if (!handlers.has(key)) handlers.set(key, []);
  handlers.get(key)!.push(callback);
}

export function unlisten(key: State) {
  handlers.delete(key);
}
