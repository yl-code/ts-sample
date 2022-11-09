import 'reflect-metadata';

type ClassStruct<T = any> = new (...args: any[]) => T;

export class Container {
  private static services = new Map<string, ClassStruct>();
  static propRegistry = new Map<string, string>();

  static set(key: string, value: ClassStruct): void {
    Container.services.set(key, value);
  }

  static get<T = any>(key: string): T | undefined {
    const Cls = Container.services.get(key);
    if (!Cls) return undefined;

    // 此时说明取出了已注册的类，需要返回其实例
    const instance = new Cls();

    for (const [injectKey, serviceKey] of Container.propRegistry) {
      const [className, propKey] = injectKey.split(':');

      if (className !== Cls.name) continue;

      const target = Container.get(serviceKey);

      if (!target) continue;

      instance[propKey] = target;
    }

    return instance;
  }

  private constructor() {} // 防止 Container 被错误实例化
}

export function Provide(key: string): ClassDecorator {
  return (target) => {
    Container.set(key, target as unknown as ClassStruct);
  };
}

export function Inject(serviceKey: string): PropertyDecorator {
  return (prototype, propKey) => {
    // Car:driver DriverService
    Container.propRegistry.set(
      `${prototype.constructor.name}:${String(propKey)}`, // injectKey
      serviceKey
    );
  };
}
