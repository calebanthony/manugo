import { writable } from 'svelte/store';

export class Trigger {
  constructor() {
    const { subscribe, set, update } = writable({
      unlocked: false,
    });
    this.subscribe = subscribe;
    this.set = set;
    this.update = update;
    this.criteria = null;
    this.callback = null;
  }

  when(model, number) {
    const unsubscribe = this.subscribe((store) => {
      const unsubModel = model.subscribe((value) => {
        console.log(value >= number);
        console.log(store.unlocked === false);
        console.log(this.callback);
        if (value >= number && !store.unlocked && this.callback) {
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
}
