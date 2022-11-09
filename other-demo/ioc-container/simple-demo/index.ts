import { Inject, Provide, Container } from './core';

@Provide('DriverService')
class Driver {
  adapt(consumer: string) {
    console.log('驱动已生效于', consumer);
  }
}

@Provide('Car')
class Car {
  @Inject('DriverService')
  driver: Driver;

  run() {
    this.driver.adapt('Car');
  }
}

const car = Container.get<Car>('Car');
car?.run(); // 驱动已生效与 Car
