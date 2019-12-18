export class Loop {
  constructor() {
    this.previous = localStorage.getItem('previous') ? localStorage.getItem('previous') : Date.now();
    this.tickDuration = 50;
    this.tickCounter = 0;
    this.accumulatedTime = 0;
    this.tickMethods = null;
  }

  load() {
    Object.entries(inventory).forEach(([key, item]) => {
      const json = localStorage.getItem(key);
      if (json) store.set(JSON.parse(json));
      store.subscribe(value => localStorage.setItem(key, JSON.stringify(value)));
    });
  }

  start() {
    requestAnimationFrame(this.start.bind(this));
    const now = Date.now();

    this.accumulatedTime += this.previous ? now - this.previous : this.tickDuration;
    this.previous = now;

    while (this.accumulatedTime > this.tickDuration) {
      this.accumulatedTime -= this.tickDuration;
      this.tick();
    }
  }

  tick() {
    this.updatePrevious();
    Object.values(this.tickMethods).forEach((method) => {
      method.produce();
    });
  }

  updatePrevious() {
    if (this.tickCounter++ >= (2000 / this.tickDuration)) {
      this.tickCounter = 0;
      localStorage.setItem('previous', Date.now())
    }
  };

  with(methods) {
    this.tickMethods = methods;
    return this;
  }
}

