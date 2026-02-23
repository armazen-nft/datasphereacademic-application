# Garantir que a pasta docs exista
if (!(Test-Path ".\docs")) {
    New-Item -ItemType Directory -Path ".\docs"
}

# Criar GOVERNANCE.md com codificaÃƒÂ§ÃƒÂ£o UTF-8 correta
Set-Content -Path ".\docs\GOVERNANCE.md" -Value @"
# GovernanÃƒÂ§a CientÃƒÂ­fica Ã¢â‚¬â€œ Datasphere Academic

Este documento define o modelo de governanÃƒÂ§a do Datasphere Academic.

Seu objetivo ÃƒÂ© garantir que decisÃƒÂµes cientÃƒÂ­ficas nÃƒÂ£o sejam capturadas por automaÃƒÂ§ÃƒÂ£o acrÃƒÂ­tica, incentivos financeiros, popularidade ou arbitrariedade tÃƒÂ©cnica.

A governanÃƒÂ§a do sistema ÃƒÂ© orientada por princÃƒÂ­pios cientÃƒÂ­ficos, nÃƒÂ£o por mÃƒÂ©tricas de engajamento ou consenso algorÃƒÂ­tmico opaco.

---

## PrincÃƒÂ­pios de GovernanÃƒÂ§a

O Datasphere Academic opera segundo os seguintes princÃƒÂ­pios fundamentais:

1. Primazia do julgamento cientÃƒÂ­fico humano
2. TransparÃƒÂªncia decisÃƒÂ³ria
3. Responsabilidade explÃƒÂ­cita por decisÃƒÂµes
4. Direito ÃƒÂ  contestaÃƒÂ§ÃƒÂ£o fundamentada
5. EvoluÃƒÂ§ÃƒÂ£o controlada e documentada das regras

---

## Estrutura de GovernanÃƒÂ§a

### 1. ComitÃƒÂª CientÃƒÂ­fico

O ComitÃƒÂª CientÃƒÂ­fico ÃƒÂ© o ÃƒÂ³rgÃƒÂ£o mÃƒÂ¡ximo de decisÃƒÂ£o acadÃƒÂªmica da plataforma.

ComposiÃƒÂ§ÃƒÂ£o:
- Pesquisadores humanos com experiÃƒÂªncia comprovada
- Diversidade de ÃƒÂ¡reas do conhecimento
- Mandatos temporÃƒÂ¡rios e rotativos

Responsabilidades:
- Definir critÃƒÂ©rios cientÃƒÂ­ficos oficiais
- Supervisionar revisÃƒÂµes complexas ou controversas
- Avaliar falhas sistÃƒÂªmicas de validaÃƒÂ§ÃƒÂ£o
- Autorizar mudanÃƒÂ§as estruturais nos critÃƒÂ©rios

Nenhuma IA faz parte do ComitÃƒÂª CientÃƒÂ­fico.

---

### 2. Revisores Humanos

Revisores humanos sÃƒÂ£o responsÃƒÂ¡veis pela avaliaÃƒÂ§ÃƒÂ£o de mÃƒÂ©rito cientÃƒÂ­fico.

CaracterÃƒÂ­sticas:
- AtuaÃƒÂ§ÃƒÂ£o identificÃƒÂ¡vel dentro do sistema
- HistÃƒÂ³rico pÃƒÂºblico de revisÃƒÂµes
- Responsabilidade pelas decisÃƒÂµes tomadas

Revisores podem:
- Aceitar trabalhos
- Rejeitar trabalhos
- Solicitar revisÃƒÂµes
- Divergir entre si, desde que justificado

---

### 3. Papel da InteligÃƒÂªncia Artificial

A InteligÃƒÂªncia Artificial possui papel estritamente auxiliar.

Ela pode:
- Produzir relatÃƒÂ³rios tÃƒÂ©cnicos
- Identificar padrÃƒÂµes formais
- Sinalizar inconsistÃƒÂªncias
- Auxiliar revisores humanos

Ela nÃƒÂ£o pode:
- Tomar decisÃƒÂµes finais
- Vetar publicaÃƒÂ§ÃƒÂµes
- Definir critÃƒÂ©rios cientÃƒÂ­ficos
- Participar de votaÃƒÂ§ÃƒÂµes de governanÃƒÂ§a

---

## Processo DecisÃƒÂ³rio

### Fluxo padrÃƒÂ£o de decisÃƒÂ£o

1. SubmissÃƒÂ£o do trabalho
2. Triagem tÃƒÂ©cnica assistida por IA
3. AvaliaÃƒÂ§ÃƒÂ£o por revisores humanos
4. ConsolidaÃƒÂ§ÃƒÂ£o da decisÃƒÂ£o
5. Registro da justificativa

Toda decisÃƒÂ£o deve ser acompanhada de justificativa textual clara.

---

## DiscordÃƒÂ¢ncia e ApelaÃƒÂ§ÃƒÂ£o

Autores tÃƒÂªm direito a:

- ContestaÃƒÂ§ÃƒÂ£o fundamentada de decisÃƒÂµes
- SolicitaÃƒÂ§ÃƒÂ£o de nova rodada de revisÃƒÂ£o
- Encaminhamento ao ComitÃƒÂª CientÃƒÂ­fico em casos excepcionais

Nenhuma decisÃƒÂ£o ÃƒÂ© irrevogÃƒÂ¡vel sem possibilidade de revisÃƒÂ£o.

---

## PrevenÃƒÂ§ÃƒÂ£o de Captura SistÃƒÂªmica

Para evitar degradaÃƒÂ§ÃƒÂ£o da qualidade cientÃƒÂ­fica, o sistema adota:

- Rotatividade obrigatÃƒÂ³ria de revisores
- ProibiÃƒÂ§ÃƒÂ£o de mÃƒÂ©tricas de popularidade como critÃƒÂ©rio decisÃƒÂ³rio
- Auditoria periÃƒÂ³dica de decisÃƒÂµes
- Registro histÃƒÂ³rico de mudanÃƒÂ§as de governanÃƒÂ§a

---

## EvoluÃƒÂ§ÃƒÂ£o da GovernanÃƒÂ§a

MudanÃƒÂ§as neste modelo sÃƒÂ³ podem ocorrer mediante:

- Proposta documentada
- Justificativa cientÃƒÂ­fica explÃƒÂ­cita
- AvaliaÃƒÂ§ÃƒÂ£o do ComitÃƒÂª CientÃƒÂ­fico
- Registro pÃƒÂºblico da alteraÃƒÂ§ÃƒÂ£o

GovernanÃƒÂ§a nÃƒÂ£o evolui por conveniÃƒÂªncia tÃƒÂ©cnica, mas por necessidade cientÃƒÂ­fica.

---

## TransparÃƒÂªncia e Auditoria

Todos os processos de governanÃƒÂ§a sÃƒÂ£o:

- Documentados
- Versionados
- AuditÃƒÂ¡veis publicamente

A opacidade ÃƒÂ© considerada falha crÃƒÂ­tica do sistema.

---


## 5. Sistema de Meritocracia e Reputação (v1)

### Cálculo de Reputação
- +10 por validação humana concluída
- +25 por artigo aceito que recebeu ≥ 5 citações
- -reputação_decay_rate (configurável no .env)
- Bônus Lua: +15 por script aprovado e usado pela comunidade

### Proteção Anti-Sybil
- Obrigatório vincular ORCID (verificado)
- Email institucional ou GitHub com histórico ≥ 6 meses
- Primeiros 6 meses: governança centralizada pelo Comitê Fundador (armazen-nft + 3 pesquisadores convidados)
- Após 6 meses: eleição rotativa do Comitê Científico

### Ataques comuns bloqueados
- Farm de contas → bloqueado por ORCID
- Review bombing → score mínimo + justificativa obrigatória
- Self-citation excessiva → penalidade automática

## Nota Final

A credibilidade do Datasphere Academic depende mais da qualidade de sua governanÃƒÂ§a do que de qualquer tecnologia utilizada.

Sem governanÃƒÂ§a cientÃƒÂ­fica rigorosa, nÃƒÂ£o existe validaÃƒÂ§ÃƒÂ£o acadÃƒÂªmica legÃƒÂ­tima.
"@ -Encoding utf8

# Commit e push
git add docs/GOVERNANCE.md
git commit -m "Adiciona GOVERNANCE.md: modelo explÃƒÂ­cito de governanÃƒÂ§a cientÃƒÂ­fica e decisÃƒÂ³ria"
git push -u origin main --force
