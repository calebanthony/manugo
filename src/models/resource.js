import { writable } from "svelte/store";

export class Resource {
  constructor() {
    const { subscribe, set, update } = writable({
      count: 0,
      unlocked: false
    });
    this.subscribe = subscribe;
    this.update = update;
    this.set = set;
    this.tickCounter = 0;
    this.tickInterval = 5;
  }

  increment(num = 1) {
    return this.update(store => {
      store.count += num;
      return store;
    });
  }

  decrement(num = 1) {
    return this.update(store => {
      store.count -= num;
      return store;
    });
  }

  reset() {
    return this.update(store => {
      store.count = 0;
      return store;
    });
  }

  unlock() {
    return this.update(store => {
      store.unlocked = true;
      return store;
    });
  }
}
