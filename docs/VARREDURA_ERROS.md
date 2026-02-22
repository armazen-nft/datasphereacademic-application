# Varredura de erros (diagnóstico rápido)

Data: 2026-02-22

## Comandos executados

1. `npm run lint`
2. `rg -n "^(<<<<<<<|=======|>>>>>>>)"`
3. `sed -n '1,220p' tsconfig.json`
4. `sed -n '1,220p' postcss.config.js`
5. `sed -n '1,140p' src/lib/utils.ts`

## Problemas encontrados

### 1) `package.json` inválido (bloqueador)
- O arquivo contém marcadores de conflito de merge (`<<<<<<<`, `=======`, `>>>>>>>`).
- Efeito: qualquer comando npm falha imediatamente com `EJSONPARSE`.
- Evidência: `npm run lint` falha antes de executar o lint.

### 2) Conflitos de merge versionados no repositório
Foram encontrados marcadores de conflito nos arquivos:

- `.env.example`
- `package.json`
- `postcss.config.js`
- `src/lib/utils.ts`
- `src/types/index.ts`
- `tsconfig.json`

Impacto:
- Quebra de parsing (JSON/TS/JS), build e ferramentas de qualidade.
- Alto risco de comportamento inconsistente por mistura de duas bases (Vite/React e Next.js).

### 3) Configuração de projeto inconsistente (Vite x Next)
- Há blocos conflitantes para scripts/deps de Vite e de Next dentro de `package.json`.
- `tsconfig.json` também contém duas estratégias diferentes (references de Vite e config de Next).
- `postcss.config.js` alterna sintaxe ESM/CJS em conflito.

## Severidade sugerida

- **Crítica**: `package.json` inválido.
- **Crítica**: conflitos de merge presentes em arquivos de runtime/config.
- **Alta**: divergência arquitetural (Vite vs Next) sem resolução.

## Recomendações objetivas

1. Resolver conflitos de merge em todos os arquivos listados.
2. Escolher **uma** base de frontend (Vite ou Next) e remover a outra dos arquivos de configuração/dependências.
3. Após resolução:
   - rodar `npm install`
   - rodar `npm run lint`
   - rodar `npm run build`
   - rodar `npm test` (se aplicável)

