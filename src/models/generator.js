import { writable } from 'svelte/store';

export class Generator {
  constructor(name) {
    const { subscribe, update, set } = writable({
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
    this.flavor = null;
    this.dependencies = {};
  }

  setStore(key, value) {
    this.update((store) => Object.assign(store, { [key]: value }));
    return this;
  }

  load() {
    Object.keys(this.dependencies).forEach((dep) => {
      this.dependencies[dep].subscribe((store) => {
        this.dependencies[dep] = store;
      });
    });

    this.subscribe((store) => {
      this.dependencies['self'] = store;
    });
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

  setFlavor(text) {
    this.flavor = text;
    return this;
  }
}
