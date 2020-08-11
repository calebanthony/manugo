import { writable } from 'svelte/store';

export class Generator {
  constructor(name) {
    const { subscribe, set, update } = writable({
      active: false,
      unlocked: false,
    });
    this.subscribe = subscribe;
    this.update = update;
    this.set = set;
    this.tickCounter = 0;
    this.tickInterval = 5;
    this.name = name;
    this.icon = null;
  }

  activate() {
    this.update((store) => {
      this.onActivate();
      store.active = true;
      return store;
    });
    return this;
  }

  onActivate() { }

  deactivate() {
    this.update((store) => {
      this.onDeactivate();
      store.active = false;
      return store;
    });
    return this;
  }

  onDeactivate() { }

  unlock() {
    this.update((store) => {
      this.onUnlock();
      store.unlocked = true;
      return store;
    });
    return this;
  }

  onUnlock() { }

  produce() {
    const unsubscribe = this.subscribe(({ active }) => {
      if (!active) return;
      this.tickCounter++;
      while (this.tickCounter >= this.tickInterval) {
        this.tickCounter -= this.tickInterval;
        this.onTick();
      }
    });
    unsubscribe();
  }

  onTick() { }

  setIcon(icon) {
    this.icon = icon;
    return this;
  }
}
