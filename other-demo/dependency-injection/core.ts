import 'reflect-metadata';

export enum MetadataKey {
  Method = 'ioc:method',
  Path = 'ioc:path',
  Middleware = 'ioc:middleware',
}

export enum RequestMethod {
  GET = 'ioc:get',
  POST = 'ioc:post',
}

export const Controller = (path?: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(MetadataKey.Path, path ?? '', target);
  };
};

export const methodDecoratorFactory = (method: RequestMethod) => {
  return (path: string): MethodDecorator => {
    return function (_target, _key, descriptor) {
      Reflect.defineMetadata(MetadataKey.Method, method, descriptor.value!);
      Reflect.defineMetadata(MetadataKey.Path, path, descriptor.value!);
    };
  };
};

export const Get = methodDecoratorFactory(RequestMethod.GET);
export const Post = methodDecoratorFactory(RequestMethod.POST);

type AsyncFunc = (...args: any[]) => Promise<any>;

interface ICollected {
  path: string;
  requestMethod: string;
  requestHandler: AsyncFunc;
}

export const routerFactory = <T extends object>(ins: T): ICollected[] => {
  const prototype = Reflect.getPrototypeOf(ins) as any;

  const rootPath = Reflect.getMetadata(
    MetadataKey.Path,
    prototype.constructor
  ) as string;

  const methods = Reflect.ownKeys(prototype).filter(
    (item) => item != 'constructor'
  ) as string[];

  const collected = methods.map((m) => {
    const requestHandler = prototype[m];
    const path = Reflect.getMetadata(MetadataKey.Path, requestHandler);

    const requestMethod = Reflect.getMetadata(
      MetadataKey.Method,
      requestHandler
    ).replace('ioc:', '');

    return {
      path: `${rootPath}${path}`,
      requestMethod,
      requestHandler,
    };
  });

  return collected;
};
