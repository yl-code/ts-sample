import 'reflect-metadata';

type ClassStruct<T = any> = new (...arg: any[]) => T;

type ServiceKey<T = any> = string | ClassStruct<T> | Function;

export class Container {
  private constructor() {} // 防止被错误实例化

  private static services: Map<ServiceKey, ClassStruct> = new Map();

  // class:prop -> serviceKey
  static propRegistry: Map<string, string> = new Map();

  static set(key: ServiceKey, value: ClassStruct): void {
    Container.services.set(key, value);
  }

  static get<T = any>(key: ServiceKey): T | undefined {
    // 检查是否已注册 key 对应的 class
    const Cls = Container.services.get(key);
    if (!Cls) return;

    // 实例化这个类
    const instance = new Cls();

    // 遍历注册信息
    for (const [injectKey, serviceKey] of Container.propRegistry) {
      // 拆分为 class名 与属性名
      const [classKey, propKey] = injectKey.split(':');

      // 如果当前注册信息不是 instance 对应的 class 就直接 continue
      if (classKey !== Cls.name) continue;

      // 取出 serviceKey 对应的实例
      const target = Container.get(serviceKey);

      if (target) {
        instance[propKey] = target; // 赋值给对应的属性
      }
    }

    return instance;
  }
}

export function Provide(key?: string): ClassDecorator {
  return (Cls) => {
    Container.set(key ?? Cls.name, Cls as unknown as ClassStruct);
    Container.set(Cls, Cls as unknown as ClassStruct); // 这是由于下面代码中 'design:type' 所对应的元数据为 类本身
  };
}

export function Inject(key?: string): PropertyDecorator {
  return (prototype, propKey) => {
    // Car:driver -> DriverService
    // 为 Car 类的实例的 driver 属性注入 DriverService 的实例
    Container.propRegistry.set(
      `${prototype.constructor.name}:${String(propKey)}`,
      key ?? Reflect.getMetadata('design:type', prototype, propKey)
    );
  };
}
