# Manugo

This is a library for developers to aid in the creation of incremental games using the [Svelte](//github.com/sveltejs/svelte/) library.

If you like starting from scratch, this is the repo for you.

If you'd rather see what a real game looks like built with this library, including architecture design and more, check out [Fueling Infinity](//github.com/calebanthony/fuelinginfinity/).

## Installation
Not yet

## Loop
The loop built in to Manugo allows for offline ticking, background tab ticking, and automatic saving to the player's localstorage.

The default tick duration is 50ms, but feel free to change it by passing another number (in ms) like `new Loop(33)`. Be careful to not change this after building your game! Your models will be built to function per *tick*, not per any unit of time.

To initiate the loop in your game:

```js
import { Loop } from 'manugo';

(new Loop())
  .load({ ...generators, ...resources, ...triggers, ...unlocks })
  .withTickMethods({ ...generators })
  .start();
```

Don't worry about the other elements for now, we'll get to them later.

## Resource
The primary model you'll want to get started with in Manugo is a resource.

To create your own resource, extend the `Resource` class from Manugo:

```js
import { Resource } from 'manugo';

export const stick = (new Resource('Stick')).setIcon('staff').unlock();
```

This creates a new resource named `Stick` with a bunch of handy methods already attached.

All resources start with a default of 0 count.

`increment()` increases the count by 1 by default, but you can use `increment(100)` to increase it by 100, for example.

`decrement()` works the same way as `increment()`, just backwards! It also returns `true` or `false` depending on if there are enough resources to decrement by. You can use this to check single cases of resources while exchanging, for example turning 1 Log into 2 Sticks. If you need to check more than one resource, check out `dependencies` on Generators below.

```js
if (log.decrement()) {
  stick.increment(2);
}
```

`reset()` sets the resource count back to 0.

`unlock()` unlocks the resource. If you want a resource to be unlocked from the beginning, you can call `.unlock()` when you create the resource, as defined above.

If you need custom logic or want *literally* anything else, just just extend the Resource class!

## Generators
Generators are unique from other models in that they have methods that are called every tick.

Generators need to be registered in the loop under the `withTickMethods()` method, as shown above.

To set up a new generator, extend the `Generator` class from Manugo in your own file:

```js
import { Generator } from 'manugo';
import { stick } from '../resources/stick';

class StickProducer extends Generator {
  constructor(name) {
    super(name); // The name is a required parameter on every generator, don't forget to include it!
    this.tickInterval = 5;

    // This isn't necessary for this use case, but you can define dependencies to access their store values.
    // For example, if we needed to make sure there are a certain number of sticks before doing something:
    /**
     * if (this.dependencies.stick.count >= 3) {
     *   doSomething();
     * }
     */
    this.dependencies { stick };
  }

  // Put your own custom logic here!

  onTick() {
    stick.increment(2);
  }

  // Other events you can hook into:
  onActivate() {
    // This is when a user activates this generator
    // Maybe this is a cost to let the user get started
  }

  onDeactivate() {
    // This is when a user deactivates this generator
  }

  onUnlock() {
    // Triggers once when this generator is unlocked with <Class>.unlock()
  }
}

export const stickProducer = new StickProducer('Gather Sticks').setIcon('staff');
```

All models start off locked by default, but you can unlock them using `<class>.unlock()`.

In your view, in order to start a generator working, you will need to call `<producer>.activate()`, and you can also stop a generator from working using `<producer>.deactivate()`. Firing these methods will also trigger your hooks as defined above in the sample class.

## Triggers
A trigger is something that happens automatically but only once in your game. Maybe this is showing a possible upgrade, giving achievements, or rewarding a player with an event that's external to the current action.

In this example, you can see that `stick` is a Resource that I've already created and has the default `increment()` method.

```js
import { Trigger } from 'manugo';
import { stick } from '../resources/stick';

const increaseSticks = () => {
  stick.increment(500);
}

export const stickReward = (new Trigger()).when(stick, 350).execute(increaseSticks);
```

The crux of the trigger is the `.when()` method. The first argument needs to be a Resource model that you have imported, and the second needs to be a number.

The `execute()` method receives a function that gets executed when the `.when()` criteria is met.

For this example then, when we have 350 sticks, we will automatically give the player 500 more sticks, but only one time.

## Unlocks
Unlocks are similar to triggers, but you can define several new attributes for them, like a description or a cost.

```js
import { Unlock } from 'manugo';
import { stick } from '../resources/stick';
import { roughStone } from '../resources/roughStone';

const onUnlock = () => {
  roughStone.unlock();
}

export const unlockRoughStones = new Unlock('Rough Stones')
  .setDescription('Unlocks the ability to collect rough stones.')
  .setCost(stick, 40)
  .makeVisibleWhen(stick, 10)
  .execute(onUnlock);
```

In this example, we have an unlock we're naming `Rough Stones` with a clear description we'll show in a tooltip.

The cost of the unlock is set just like how you set criteria in `.when()` for a Trigger. The cost in this case is 40 sticks.

The `makeVisibleWhen` method is an optional method that will make `$unlock.visible` false until the criteria of a specific model at a specific count is met.

When the `.run()` method is called, if the player has them, 40 sticks will automatically be deducted from the player and then the `onUnlock` method will be called, which in this case unlocks `Rough Stone` for us.

As you can see, you can really do whatever you want in the `.execute()` method, so this could purchase upgrades, allow a user to do a flat one-time exchange (Triggers and Unlocks can only happen once!) of one resource to another, or many other things.
