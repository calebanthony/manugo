import { writable } from "svelte/store";

export class Resource {
  constructor(name) {
    const { subscribe, update } = writable({
      count: 0,
      unlocked: false
    });
    this.subscribe = subscribe;
    this.update = update;
    this.tickCounter = 0;
    this.tickInterval = 5;
    this.name = name;
    this.icon = null;
  }

  set(key, value) {
    this.update(store => Object.assign(store, { [key]: value }));
    return this;
  }

  increment(num = 1) {
    this.update(store => {
      store.count += num;
      return store;
    });

    return this;
  }

  decrement(num = 1) {
    let hasEnough = false;

    this.update(store => {
      if (store.count >= num) {
        store.count -= num;
        hasEnough = true;
      }
      return store;
    });

    return hasEnough;
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
