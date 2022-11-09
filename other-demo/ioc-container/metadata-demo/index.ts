import { Inject, Provide, Container } from './core';

@Provide('DriverService')
class Driver {
  adapt(consumer: string) {
    console.log('驱动已生效于', consumer);
  }
}

@Provide()
class Fuel {
  fill(consumer: string) {
    console.log('燃料已填充完毕', consumer);
  }
}

@Provide()
class Car {
  @Inject()
  driver: Driver;

  @Inject()
  fuel: Fuel;

  run() {
    this.fuel.fill('car');
    this.driver.adapt('car');
  }
}

@Provide()
class Bus {
  @Inject('DriverService')
  driver: Driver;

  @Inject('Fuel')
  fuel: Fuel;

  run() {
    this.fuel.fill('bus');
    this.driver.adapt('bus');
  }
}

const car = Container.get<Car>(Car)!;
const bus = Container.get<Bus>(Bus)!;

car.run();
bus.run();
