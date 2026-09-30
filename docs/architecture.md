# Arquitetura

## Camadas

As dependências apontam para dentro:

| Camada         | Pode importar                        | Não pode importar                                   |
| -------------- | ------------------------------------ | --------------------------------------------------- |
| `domain`       | nada de outras camadas               | `application`, `infra`, `presentation`, `@nestjs/*` |
| `application`  | `domain`                             | `infra`, `presentation`, `@nestjs/*`                |
| `presentation` | `application`, `domain`, `@nestjs/*` | `infra`                                             |
| `infra`        | tudo (raiz de composição)            | —                                                   |

`infra` pode importar `presentation` porque os módulos vivem em `infra/modules/` e registram os controllers.

Dentro de `infra/` a organização é por tipo de arquivo (`configs/`, `services/`, `helpers/`, `modules/`). Quando uma pasta acumular vários arquivos do mesmo papel, separe (por exemplo `repositories/` e `gateways/`). Não crie pastas vazias antecipadamente: `domain/` só aparece quando surgir a primeira entidade com regra de negócio.

## Verificação pelo lint

A regra é aplicada pelo oxlint, em `.oxlintrc.json`, com `no-restricted-imports` por pasta (via `overrides`) e `import/no-cycle`. Uma violação faz o `pnpm lint` falhar.

Cuidados ao mexer nessa configuração:

- Declarar `plugins` **substitui o conjunto padrão**. Mantenha `eslint`, `typescript`, `unicorn`, `oxc` e `import`. Sem `eslint`, as regras de camada param de funcionar; sem `import`, o `no-cycle` não faz nada.
- Um `override` substitui o valor inteiro da regra, inclusive a severidade.
- Use `group`, não `regex`, nos padrões. Cubra o alias (`@/infra/**`) e o caminho relativo (`**/infra/**`).
- Os erros aparecem duplicados na saída; é só cosmético.
- O `import/no-cycle` só enxerga os arquivos analisados, então rode o `pnpm lint` completo no CI.

## Injeção de dependência sem `@Injectable()`

Para manter `domain` e `application` sem imports do Nest, os casos de uso são classes comuns, registradas nos módulos com `makeInjectable` (`src/infra/helpers/make-injectable.ts`):

```ts
providers: [
  { provide: FeedbackRepository, useClass: MongoFeedbackRepository },
  makeInjectable(CreateFeedbackUseCase, [FeedbackRepository, AppConfig]),
];
```

- Os tokens devem ser classes abstratas (interfaces não existem em runtime) ou string/symbol. Prefira symbols exportados de uma constante a strings soltas.
- O TypeScript confere a quantidade de dependências e o tipo das classes contra o construtor. **Não** confere a ordem nem o tipo de tokens string/symbol.
- Providers criados por factory são singleton; `Scope.REQUEST` e decorators de DI no construtor (`@Inject`, `@Optional`) não se aplicam.
- Casos de uso sem dependências precisam de `[]` explícito.
- O helper fica em `infra/` porque importa do Nest; só os módulos o usam.

## Ports

Uma port é uma classe abstrata em `application/ports/`, sem nenhum import. A `infra` a implementa e o módulo liga os dois com `useExisting` ou `useClass`. Veja o exemplo do `AppConfig` em [configuration.md](configuration.md).
