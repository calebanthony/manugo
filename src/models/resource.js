import { writable } from "svelte/store";

export class Resource {
  constructor(name) {
    const { subscribe, set, update } = writable({
      count: 0,
      unlocked: false
    });
    this.subscribe = subscribe;
    this.update = update;
    this.set = set;
    this.tickCounter = 0;
    this.tickInterval = 5;
    this.name = name;
    this.icon = null;
  }

  increment(num = 1) {
    this.update(store => {
      store.count += num;
      return store;
    });

    return this;
  }

  decrement(num = 1) {
    this.update(store => {
      store.count -= num;
      return store;
    });

    return this;
  }

  reset() {
    this.update(store => {
      store.count = 0;
      return store;
    });

    return this;
  }

  unlock() {
    this.update(store => {
      store.unlocked = true;
      return store;
    });

    return this;
  }

  setIcon(icon) {
    this.icon = icon;

    return this;
  }
}
