# ESM, SWC e path aliases

Armadilhas de rodar Nest em ESM com SWC.

- **Imports relativos e com alias precisam da extensão `.js`**, mesmo sendo arquivos `.ts`. O TypeScript só avisa nos relativos; um `@/...` sem extensão compila e quebra em runtime (`ERR_MODULE_NOT_FOUND`).
- **O SWC não reescreve aliases sozinho.** O `.swcrc` precisa de `jsc.paths` (espelhando o `tsconfig.json`), de `jsc.baseUrl` e de `module: { "type": "es6", "resolveFully": true }`. O `resolveFully` completa extensões e transforma imports de pasta em `.../index.js`.
- O `nest-cli.json` declara `"builder": "swc"` e `"typeCheck": true`, porque o SWC não verifica tipos.
- `decoratorMetadata: true` no `.swcrc` é indispensável para a injeção por tipo do Nest.
- Evite barrels (`index.ts`): em ESM eles causam ciclos e problemas de resolução. Importe direto do arquivo.
- `__dirname` e `require` não existem; use `import.meta.dirname` (Node 20.11+) e `import`.
- Ao adicionar um alias, declare-o nos dois lugares: `tsconfig.json` e `.swcrc`.

## Validando o build de produção

O Vitest resolve aliases por conta própria, então os testes podem passar enquanto o build falha. Valide o artefato:

```bash
pnpm build
grep -rn "from '@/" dist/ || echo "ok: nenhum alias sobrou"
NODE_ENV=production node dist/main.js
```

Vale manter esse passo no CI.
