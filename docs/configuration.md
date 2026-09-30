# Configuração

O zod valida as variáveis de ambiente uma vez, no boot. O `AppConfigService` é só uma camada tipada de leitura por cima do que já foi validado.

```
.env  →  ConfigModule (validate: zod)  →  ConfigService  →  AppConfigService  →  seu código
```

## Variáveis

Definidas em `src/infra/configs/env.schema.ts`:

| Variável    | Padrão                                                |
| ----------- | ----------------------------------------------------- |
| `NODE_ENV`  | `development` (`development`, `test` ou `production`) |
| `APP_NAME`  | `nest-worker`                                         |
| `PORT`      | `3000`                                                |
| `LOG_LEVEL` | `info` (inclui `silent`)                              |

## Arquivos

- **`.env`**: usado fora dos testes. Não é versionado; crie a partir do `.env.example`.
- **`.env.test`**: usado quando `NODE_ENV=test` (o Vitest define). É versionado, sem segredos, e não tem fallback para o `.env`: se faltar algo, a validação falha em vez de os testes usarem o banco de desenvolvimento.
- Variáveis já presentes em `process.env` (Docker, plataforma) têm prioridade sobre os arquivos.

No `.gitignore`:

```
.env
.env.*
!.env.example
!.env.test
```

## Estendendo em um projeto

Estenda o schema em vez de editar o do template:

```ts
import { z } from 'zod';
import { envSchema as baseSchema } from '@/infra/configs/env.schema.js';

export const envSchema = baseSchema.extend({
  DATABASE_URL: z.url(),
});
```

Depois aponte o `validateEnv` e o tipo `Env` (usado pelo `AppConfigService`) para o schema estendido.

## `AppConfig` e `AppConfigService`

As camadas internas não conhecem o `ConfigService` do Nest nem o `Env`. Elas dependem de uma classe abstrata em `src/application/ports/app-config.ts`:

```ts
export abstract class AppConfig {
  abstract get appName(): string;
  abstract get isProduction(): boolean;
  abstract get isTest(): boolean;
}
```

A infra a implementa em `src/infra/services/app-config.service.ts`, e o `AppConfigModule` (global) liga os tokens com `useExisting`.

- Use getters abstratos, não campos abstratos, para não correr o risco de o compilador emitir campos que escondam os getters da subclasse.
- Exponha à `application` valores com significado de negócio, não variáveis cruas. Para a configuração de uma feature, crie uma port própria.
- Ao usar o `ConfigService` do Nest diretamente, passe `{ infer: true }` no `get`, senão o retorno é `any`.
- O `get<K extends keyof Env>()` do `AppConfigService` é de uso interno da infra (pino, `main.ts`).
