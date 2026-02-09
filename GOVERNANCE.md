# Garantir que a pasta docs exista
if (!(Test-Path ".\docs")) {
    New-Item -ItemType Directory -Path ".\docs"
}

# Criar GOVERNANCE.md com codificaÃ§Ã£o UTF-8 correta
Set-Content -Path ".\docs\GOVERNANCE.md" -Value @"
# GovernanÃ§a CientÃ­fica â€“ Datasphere Academic

Este documento define o modelo de governanÃ§a do Datasphere Academic.

Seu objetivo Ã© garantir que decisÃµes cientÃ­ficas nÃ£o sejam capturadas por automaÃ§Ã£o acrÃ­tica, incentivos financeiros, popularidade ou arbitrariedade tÃ©cnica.

A governanÃ§a do sistema Ã© orientada por princÃ­pios cientÃ­ficos, nÃ£o por mÃ©tricas de engajamento ou consenso algorÃ­tmico opaco.

---

## PrincÃ­pios de GovernanÃ§a

O Datasphere Academic opera segundo os seguintes princÃ­pios fundamentais:

1. Primazia do julgamento cientÃ­fico humano
2. TransparÃªncia decisÃ³ria
3. Responsabilidade explÃ­cita por decisÃµes
4. Direito Ã  contestaÃ§Ã£o fundamentada
5. EvoluÃ§Ã£o controlada e documentada das regras

---

## Estrutura de GovernanÃ§a

### 1. ComitÃª CientÃ­fico

O ComitÃª CientÃ­fico Ã© o Ã³rgÃ£o mÃ¡ximo de decisÃ£o acadÃªmica da plataforma.

ComposiÃ§Ã£o:
- Pesquisadores humanos com experiÃªncia comprovada
- Diversidade de Ã¡reas do conhecimento
- Mandatos temporÃ¡rios e rotativos

Responsabilidades:
- Definir critÃ©rios cientÃ­ficos oficiais
- Supervisionar revisÃµes complexas ou controversas
- Avaliar falhas sistÃªmicas de validaÃ§Ã£o
- Autorizar mudanÃ§as estruturais nos critÃ©rios

Nenhuma IA faz parte do ComitÃª CientÃ­fico.

---

### 2. Revisores Humanos

Revisores humanos sÃ£o responsÃ¡veis pela avaliaÃ§Ã£o de mÃ©rito cientÃ­fico.

CaracterÃ­sticas:
- AtuaÃ§Ã£o identificÃ¡vel dentro do sistema
- HistÃ³rico pÃºblico de revisÃµes
- Responsabilidade pelas decisÃµes tomadas

Revisores podem:
- Aceitar trabalhos
- Rejeitar trabalhos
- Solicitar revisÃµes
- Divergir entre si, desde que justificado

---

### 3. Papel da InteligÃªncia Artificial

A InteligÃªncia Artificial possui papel estritamente auxiliar.

Ela pode:
- Produzir relatÃ³rios tÃ©cnicos
- Identificar padrÃµes formais
- Sinalizar inconsistÃªncias
- Auxiliar revisores humanos

Ela nÃ£o pode:
- Tomar decisÃµes finais
- Vetar publicaÃ§Ãµes
- Definir critÃ©rios cientÃ­ficos
- Participar de votaÃ§Ãµes de governanÃ§a

---

## Processo DecisÃ³rio

### Fluxo padrÃ£o de decisÃ£o

1. SubmissÃ£o do trabalho
2. Triagem tÃ©cnica assistida por IA
3. AvaliaÃ§Ã£o por revisores humanos
4. ConsolidaÃ§Ã£o da decisÃ£o
5. Registro da justificativa

Toda decisÃ£o deve ser acompanhada de justificativa textual clara.

---

## DiscordÃ¢ncia e ApelaÃ§Ã£o

Autores tÃªm direito a:

- ContestaÃ§Ã£o fundamentada de decisÃµes
- SolicitaÃ§Ã£o de nova rodada de revisÃ£o
- Encaminhamento ao ComitÃª CientÃ­fico em casos excepcionais

Nenhuma decisÃ£o Ã© irrevogÃ¡vel sem possibilidade de revisÃ£o.

---

## PrevenÃ§Ã£o de Captura SistÃªmica

Para evitar degradaÃ§Ã£o da qualidade cientÃ­fica, o sistema adota:

- Rotatividade obrigatÃ³ria de revisores
- ProibiÃ§Ã£o de mÃ©tricas de popularidade como critÃ©rio decisÃ³rio
- Auditoria periÃ³dica de decisÃµes
- Registro histÃ³rico de mudanÃ§as de governanÃ§a

---

## EvoluÃ§Ã£o da GovernanÃ§a

MudanÃ§as neste modelo sÃ³ podem ocorrer mediante:

- Proposta documentada
- Justificativa cientÃ­fica explÃ­cita
- AvaliaÃ§Ã£o do ComitÃª CientÃ­fico
- Registro pÃºblico da alteraÃ§Ã£o

GovernanÃ§a nÃ£o evolui por conveniÃªncia tÃ©cnica, mas por necessidade cientÃ­fica.

---

## TransparÃªncia e Auditoria

Todos os processos de governanÃ§a sÃ£o:

- Documentados
- Versionados
- AuditÃ¡veis publicamente

A opacidade Ã© considerada falha crÃ­tica do sistema.

---

## Nota Final

A credibilidade do Datasphere Academic depende mais da qualidade de sua governanÃ§a do que de qualquer tecnologia utilizada.

Sem governanÃ§a cientÃ­fica rigorosa, nÃ£o existe validaÃ§Ã£o acadÃªmica legÃ­tima.
"@ -Encoding utf8

# Commit e push
git add docs/GOVERNANCE.md
git commit -m "Adiciona GOVERNANCE.md: modelo explÃ­cito de governanÃ§a cientÃ­fica e decisÃ³ria"
git push -u origin main --force
