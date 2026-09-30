<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white" alt="Node.js 24" />
  <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white" alt="NestJS 12" />
  <img src="https://img.shields.io/badge/Fastify-000000?logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/SWC-F8C457?logo=swc&logoColor=black" alt="SWC" />
  <img src="https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white" alt="Zod 4" />
  <img src="https://img.shields.io/badge/Pino-687634" alt="Pino" />
  <img src="https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white" alt="Vitest 4" />
  <img src="https://img.shields.io/badge/oxlint-2B2B2B" alt="oxlint" />
</p>

## Descrição

Template NestJS 12 em ESM para reaproveitar em projetos novos. Traz uma API HTTP (Fastify) e um worker sem HTTP, configuração validada no boot, logs estruturados, health check e lint que impõe a arquitetura em camadas.

O template não tem domínio nem ORM: cada projeto escolhe o seu banco, fila e cache.

## Como rodar

```bash
pnpm install
cp .env.example .env
pnpm start:dev          # API HTTP
pnpm start:worker:dev   # worker (outro terminal)
```

O `.env` é opcional: todas as variáveis têm valor padrão.

| Script                             | O que faz                  |
| ---------------------------------- | -------------------------- |
| `start:dev` / `start:worker:dev`   | API / worker em modo watch |
| `start:prod` / `start:worker:prod` | Executa o build em `dist/` |
| `build`                            | Compila e checa tipos      |
| `lint`                             | Roda o oxlint              |
| `test` / `test:e2e`                | Testes unitários / e2e     |

## Estrutura

```
src/
├── main.ts          # entrypoint HTTP
├── worker.ts        # entrypoint headless
├── domain/          # regras de negócio
├── application/     # casos de uso e ports
├── infra/           # implementações, config e módulos Nest
└── presentation/    # controllers
```

As dependências entre camadas apontam para dentro e são verificadas pelo lint.

## Documentação

- [Arquitetura](docs/architecture.md): camadas, regras de import e injeção de dependência
- [Configuração](docs/configuration.md): variáveis de ambiente e `AppConfig`
- [ESM, SWC e aliases](docs/esm-swc.md): armadilhas do build
- [Execução](docs/runtime.md): Fastify, logs e health check
- [Testes](docs/testing.md)

## Usando como template

Marque o repositório como _Template repository_ no GitHub e use "Use this template" a cada projeto novo. Depois, troque o `name` no `package.json`, estenda o schema de variáveis e remova o que não for usar.
