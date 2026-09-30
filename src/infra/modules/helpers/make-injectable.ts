import type { InjectionToken, Provider } from '@nestjs/common';

type AbstractClass<T> = abstract new (...args: any[]) => T;

// Para cada parâmetro do construtor, o token pode ser:
// - uma classe (abstrata ou não) cujo tipo bate com o parâmetro; ou
// - uma string/symbol (aceito sem checar o tipo)
type Tokens<A extends unknown[]> = {
  [K in keyof A]: AbstractClass<A[K]> | string | symbol;
};

export function makeInjectable<T, A extends unknown[]>(
  Class: new (...args: A) => T,
  inject: NoInfer<Tokens<A>>,
): Provider {
  return {
    provide: Class,
    useFactory: (...deps: A) => new Class(...deps),
    inject: inject as unknown as InjectionToken[],
  };
}
