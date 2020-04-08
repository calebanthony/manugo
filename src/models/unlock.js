import { writable } from 'svelte/store';

export class Unlock {
  constructor(name) {
    const { subscribe, set, update } = writable({
      unlocked: false,
      loaded: false,
      cost: {
        quantity: null,
      },
    });
    this.cost = {
      model: null,
    };
    this.subscribe = subscribe;
    this.set = set;
    this.update = update;
    this.name = name;
    this.description = null;
    this.callback = null;
  }

  run() {
    const unsubscribe = this.subscribe((store) => {
      const unsubModel = this.cost.model.subscribe((modelStore) => {
        if (modelStore.count >= store.cost.quantity && !store.unlocked && store.loaded) {
          this.cost.model.decrement(store.cost.quantity);

          this.update((store) => {
            store.unlocked = true;
            return store;
          });

          return this.callback();
        }
      });
      unsubModel();
    });

    unsubscribe();
    return this;
  }

  setCost(model, number) {
    this.cost.model = model;

    this.update((store) => {
      store.cost.quantity = number;
      return store;
    });

    return this;
  }

  setDescription(desc) {
    this.description = desc;
    return this;
  }

  execute(callback) {
    this.callback = callback;

    return this;
  }

  load() {
    return this.update((store) => {
      store.loaded = true;
      return store;
    });
  }
}
