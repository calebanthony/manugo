import { writable } from 'svelte/store';

export class Unlock {
  constructor(name) {
    const { subscribe, update, set } = writable({
      visible: true,
      unlocked: false,
      loaded: false,
    });
    this.costsToUnlock = [];
    this.subscribe = subscribe;
    this.update = update;
    this.set = set;
    this.name = name;
    this.description = null;
    this.callback = null;
  }

  setStore(key, value) {
    this.update((store) => Object.assign(store, { [key]: value }));
    return this;
  }

  run() {
    const unsubscribe = this.subscribe((store) => {
      this.costsToUnlock.forEach(({ model, number }) => {
        const unsubModel = model.subscribe((modelStore) => {
          if (modelStore.count >= number && !store.unlocked && store.loaded) {
            model.decrement(number);
  
            this.update((store) => {
              store.unlocked = true;
              return store;
            });
  
            return this.callback();
          }
        });
        unsubModel();
      });
    });

    unsubscribe();
    return this;
  }

  makeVisibleWhen(model, number) {
    this.update((store) => {
      store.visible = false;
      return store;
    });

    const unsubscribe = this.subscribe((store) => {
      const unsubModel = model.subscribe((modelStore) => {
        if (modelStore.count >= number && !store.visible && store.loaded) {
          this.update((store) => {
            store.visible = true;
            return store;
          });
          unsubModel();
          unsubscribe();
        }
      });
    });

    return this;
  }

  setCost(model, number) {
    this.costsToUnlock.push({ model, number });

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
