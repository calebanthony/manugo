export class Loop {
  constructor(tickDuration = 50) {
    this.previous = localStorage.getItem('previous') ? localStorage.getItem('previous') : Date.now();
    this.tickDuration = tickDuration;
    this.tickCounter = 0;
    this.accumulatedTime = 0;
    this.tickMethods = null;
  }

  load(state) {
    Object.entries(state).forEach(([key, item]) => {
      const json = localStorage.getItem(key);
      if (json) item.set(JSON.parse(json));

      // Logic specific to triggers, so they don't "trigger" prematurely
      // Also loads the dependencies of generators
      if (item.load) item.load();

      item.subscribe((value) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    });
    return this;
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

  withTickMethods(methods) {
    this.tickMethods = methods;
    return this;
  }
}
