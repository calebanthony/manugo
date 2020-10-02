import { writable } from 'svelte/store';

export class Trigger {
  constructor() {
    const { subscribe, update, set } = writable({
      unlocked: false,
      loaded: false,
    });
    this.subscribe = subscribe;
    this.update = update;
    this.set = set;
    this.criteria = null;
    this.callback = null;
  }

  setStore(key, value) {
    this.update((store) => Object.assign(store, { [key]: value }));
    return this;
  }

  when(model, number) {
    const unsubscribe = this.subscribe((store) => {
      const unsubModel = model.subscribe((modelStore) => {
        if (modelStore.count >= number && !store.unlocked && store.loaded) {
          this.update((store) => {
            store.unlocked = true;
            return store;
          });
          unsubModel();
          unsubscribe();
          return this.callback();
        }
      });
    });

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
