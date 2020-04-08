import { writable } from 'svelte/store';

export class Trigger {
  constructor() {
    const { subscribe, set, update } = writable({
      unlocked: false,
      loaded: false,
    });
    this.subscribe = subscribe;
    this.set = set;
    this.update = update;
    this.criteria = null;
    this.callback = null;
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
