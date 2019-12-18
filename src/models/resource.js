import { writable } from 'svelte/store';

export class Resource {
  constructor() {
    const { subscribe, set, update } = writable(0);
    this.subscribe = subscribe;
    this.update = update;
    this.set = set;
    this.tickCounter = 0;
    this.tickInterval = 5;
  }

  increment(num = 1) {
    return this.update(val => val + num);
  }

  decrement(num = 1) {
    return this.update(val => val - num);
  }

  reset() {
    return this.set(0);
  }
}
