# Garantir que a pasta docs exista
if (!(Test-Path ".\docs")) {
    New-Item -ItemType Directory -Path ".\docs"
}

# Criar CRITERIA.md com codificaÃ§Ã£o UTF-8 correta
Set-Content -Path ".\docs\CRITERIA.md" -Value @"
# CritÃ©rios de AvaliaÃ§Ã£o CientÃ­fica â€“ Datasphere Academic

Este documento define de forma explÃ­cita os critÃ©rios de avaliaÃ§Ã£o utilizados na plataforma Datasphere Academic.

Ele existe para evitar ambiguidade epistemolÃ³gica, automaÃ§Ã£o acrÃ­tica e substituiÃ§Ã£o indevida de julgamento cientÃ­fico humano por algoritmos.

Nenhuma decisÃ£o final de mÃ©rito cientÃ­fico Ã© tomada exclusivamente por InteligÃªncia Artificial.

---

## PrincÃ­pio Fundamental

A plataforma adota o seguinte princÃ­pio:

A InteligÃªncia Artificial atua apenas como ferramenta de triagem tÃ©cnica e apoio analÃ­tico.  
A avaliaÃ§Ã£o de mÃ©rito cientÃ­fico Ã© sempre humana ou hÃ­brida, com predominÃ¢ncia humana.

---

## SeparaÃ§Ã£o de Camadas de AvaliaÃ§Ã£o

### 1. Triagem TÃ©cnica Assistida por IA

A IA pode executar apenas tarefas formais e instrumentais, incluindo:

- DetecÃ§Ã£o de similaridade textual (plÃ¡gio)
- VerificaÃ§Ã£o de estrutura acadÃªmica mÃ­nima
- AnÃ¡lise de coerÃªncia textual bÃ¡sica
- IdentificaÃ§Ã£o de referÃªncias inconsistentes ou ausentes
- GeraÃ§Ã£o de relatÃ³rios auxiliares para revisores humanos

A IA **nÃ£o emite parecer cientÃ­fico final**.

---

### 2. AvaliaÃ§Ã£o CientÃ­fica Humana

A avaliaÃ§Ã£o de mÃ©rito cientÃ­fico Ã© realizada por revisores humanos qualificados e inclui:

- Validade metodolÃ³gica
- ConsistÃªncia lÃ³gica e matemÃ¡tica
- Originalidade conceitual
- RelevÃ¢ncia para a Ã¡rea de conhecimento
- AderÃªncia a princÃ­pios Ã©ticos de pesquisa

Somente humanos podem decidir aceitaÃ§Ã£o, rejeiÃ§Ã£o ou solicitaÃ§Ã£o de revisÃµes substanciais.

---

## CritÃ©rios CientÃ­ficos Fundamentais

Cada submissÃ£o deve ser analisada segundo os seguintes eixos:

### A. Metodologia
- Clareza do mÃ©todo
- Reprodutibilidade
- AdequaÃ§Ã£o estatÃ­stica ou lÃ³gica
- LimitaÃ§Ãµes explicitadas

### B. Originalidade
- ContribuiÃ§Ã£o conceitual real
- NÃ£o trivialidade em relaÃ§Ã£o ao estado da arte
- Justificativa clara do que Ã© novo

### C. FundamentaÃ§Ã£o
- Uso adequado de literatura relevante
- ReferÃªncias verificÃ¡veis
- EvitaÃ§Ã£o de citaÃ§Ãµes decorativas

### D. CoerÃªncia Interna
- AusÃªncia de contradiÃ§Ãµes internas
- Encadeamento lÃ³gico consistente
- ConclusÃµes compatÃ­veis com os dados apresentados

### E. Ã‰tica e Integridade
- AusÃªncia de fabricaÃ§Ã£o ou manipulaÃ§Ã£o de dados
- DeclaraÃ§Ã£o de conflitos de interesse quando aplicÃ¡vel
- Respeito a normas Ã©ticas da Ã¡rea

---

## O Que a Plataforma Explicitamente NÃ£o Faz

Para evitar falsas promessas tecnolÃ³gicas, o Datasphere Academic declara que:

- NÃ£o automatiza julgamento cientÃ­fico
- NÃ£o substitui revisÃ£o por pares humanos
- NÃ£o utiliza mÃ©tricas de popularidade como critÃ©rio de mÃ©rito
- NÃ£o tokeniza decisÃµes cientÃ­ficas como incentivo primÃ¡rio

---

## DiscordÃ¢ncia, ApelaÃ§Ã£o e RevisÃ£o

Autores tÃªm direito a:

- Acesso aos relatÃ³rios gerados por IA
- Justificativas humanas documentadas
- SolicitaÃ§Ã£o de nova rodada de revisÃ£o
- ContestaÃ§Ã£o fundamentada de decisÃµes

Toda decisÃ£o deve ser acompanhada de justificativa registrada.

---

## EvoluÃ§Ã£o dos CritÃ©rios

Os critÃ©rios cientÃ­ficos nÃ£o sÃ£o estÃ¡ticos.

Eles podem ser revisados por meio de:
- ComitÃªs cientÃ­ficos rotativos
- Consulta pÃºblica documentada
- Registro explÃ­cito de mudanÃ§as e suas motivaÃ§Ãµes

---

## TransparÃªncia

Este documento Ã© pÃºblico, versionado e auditÃ¡vel.

Nenhum critÃ©rio implÃ­cito ou oculto Ã© utilizado na avaliaÃ§Ã£o de trabalhos submetidos Ã  plataforma.

---

## Nota Final

A credibilidade cientÃ­fica da plataforma depende diretamente da clareza e do respeito a estes critÃ©rios.

A tecnologia deve aumentar o rigor cientÃ­fico, nunca substituÃ­-lo.
"@ -Encoding utf8

# Commit e push
git add docs/CRITERIA.md
git commit -m "Adiciona CRITERIA.md: critÃ©rios cientÃ­ficos explÃ­citos e separaÃ§Ã£o formal IA x humano"
git push -u origin main --force
