# Execução: HTTP, logs e health check

## Fastify

- O `listen` precisa de `'0.0.0.0'`, senão o app fica inacessível dentro do Docker.
- `@Req()` e `@Res()` usam os tipos do Fastify (`FastifyRequest`, `FastifyReply`).
- Middlewares do ecossistema Express (`helmet`, `compression`) têm equivalentes `@fastify/*`.

## Logs

`nestjs-pino`, configurado em `src/infra/configs/pino.config.ts` e registrado pelo `LoggerModule`.

- O nome vem de `APP_NAME` e o nível de `LOG_LEVEL`; nos testes o nível é `silent`.
- Fora de produção usa `pino-pretty`, que é devDependency. Em produção, `NODE_ENV=production` é obrigatório, senão o app tenta carregar um pacote que não existe na imagem.
- Sugestão para produção: `redact: ['req.headers.authorization', 'req.headers.cookie']` dentro de `pinoHttp`.
- Se um valor injetado chegar `undefined` na factory do pino, confira o token do `inject`: ele aceita qualquer coisa sem checagem de tipo. `config.constructor.name` mostra qual classe chegou.

## Health check (modo HTTP)

| Rota                | Pergunta              | Uso                                                                |
| ------------------- | --------------------- | ------------------------------------------------------------------ |
| `GET /health/live`  | O processo está vivo? | Se falhar, o orquestrador reinicia                                 |
| `GET /health/ready` | Consegue atender?     | Checa dependências (banco, Redis); se falhar, sai do balanceamento |

No template o `ready` não tem indicadores; cada projeto adiciona os seus.

## Worker

O worker não tem HTTP. Opções, da mais simples à mais elaborada:

1. Só restart policy do orquestrador (ponto de partida do template).
2. Heartbeat gravado periodicamente e verificado pelo healthcheck.
3. Servidor HTTP mínimo dentro do worker, se a plataforma exigir uma porta.
4. Métricas de negócio, como a idade da última execução bem-sucedida.

## Docker

Não coloque `HEALTHCHECK` no Dockerfile: a mesma imagem roda API e worker. Defina por serviço no `docker-compose.yml`, usando `127.0.0.1` em vez de `localhost` (no Alpine, `localhost` pode resolver para IPv6).
