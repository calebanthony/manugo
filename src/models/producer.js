import { writable } from 'svelte/store';

export class Producer {
  constructor() {
    const { subscribe, set, update } = writable({
      active: false,
    });
    this.subscribe = subscribe;
    this.update = update;
    this.tickCounter = 0;
    this.tickInterval = 5;
  }

  activate() {
    return this.update((store) => {
      store.active = true;
      return store;
    });
  }

  deactivate() {
    return this.update((store) => {
      store.active = false;
      return store;
    });
  }

  produce() {
    const unsubscribe = this.subscribe(({ active }) => {
      if (!active) return;
      this.tickCounter++;
      while (this.tickCounter >= this.tickInterval) {
        this.tickCounter -= this.tickInterval;
        this.produces();
      }
    });
    unsubscribe();
  }

  produces() { }
}
