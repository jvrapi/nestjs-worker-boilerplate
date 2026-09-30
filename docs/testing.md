# Testes

- Os testes usam Vitest. A configuração está em `vitest.config.ts` (unitários, `*.spec.ts`) e `vitest.config.e2e.ts` (e2e, `*.e2e-spec.ts`), ambos com `resolve: { tsconfigPaths: true }`.
- O Vitest define `NODE_ENV=test`, então o `.env.test` é carregado automaticamente (veja [configuration.md](configuration.md)).
- Casos de uso da `application` são testados com `new`, passando fakes no construtor, sem Nest:

  ```ts
  const useCase = new CreateFeedbackUseCase(fakeRepository, {
    appName: 'test',
    isProduction: false,
    isTest: true,
  });
  ```

- Nos testes e2e com Fastify, use `app.inject()` em vez de `supertest`, chamando `await app.getHttpAdapter().getInstance().ready()` antes.
- Se o DI do Nest falhar nos testes (dependências `undefined`), o esbuild do Vitest pode não estar emitindo metadata de decorators. Nesse caso, adicione `unplugin-swc` aos plugins do Vitest.
