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
    return this.update((store) => {
      store.active = true;
      this.onActivate();
      return store;
    });
  }

  onActivate() { }

  deactivate() {
    return this.update((store) => {
      store.active = false;
      this.onDeactivate();
      return store;
    });
  }

  onDeactivate() { }

  unlock() {
    return this.update((store) => {
      store.unlocked = true;
      this.onUnlock();
      return store;
    });
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
