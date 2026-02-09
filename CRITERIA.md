# Garantir que a pasta docs exista
if (!(Test-Path ".\docs")) {
    New-Item -ItemType Directory -Path ".\docs"
}

# Criar CRITERIA.md com codificaÃƒÂ§ÃƒÂ£o UTF-8 correta
Set-Content -Path ".\docs\CRITERIA.md" -Value @"
# CritÃƒÂ©rios de AvaliaÃƒÂ§ÃƒÂ£o CientÃƒÂ­fica Ã¢â‚¬â€œ Datasphere Academic

Este documento define de forma explÃƒÂ­cita os critÃƒÂ©rios de avaliaÃƒÂ§ÃƒÂ£o utilizados na plataforma Datasphere Academic.

Ele existe para evitar ambiguidade epistemolÃƒÂ³gica, automaÃƒÂ§ÃƒÂ£o acrÃƒÂ­tica e substituiÃƒÂ§ÃƒÂ£o indevida de julgamento cientÃƒÂ­fico humano por algoritmos.

Nenhuma decisÃƒÂ£o final de mÃƒÂ©rito cientÃƒÂ­fico ÃƒÂ© tomada exclusivamente por InteligÃƒÂªncia Artificial.

---

## PrincÃƒÂ­pio Fundamental

A plataforma adota o seguinte princÃƒÂ­pio:

A InteligÃƒÂªncia Artificial atua apenas como ferramenta de triagem tÃƒÂ©cnica e apoio analÃƒÂ­tico.  
A avaliaÃƒÂ§ÃƒÂ£o de mÃƒÂ©rito cientÃƒÂ­fico ÃƒÂ© sempre humana ou hÃƒÂ­brida, com predominÃƒÂ¢ncia humana.

---

## SeparaÃƒÂ§ÃƒÂ£o de Camadas de AvaliaÃƒÂ§ÃƒÂ£o

### 1. Triagem TÃƒÂ©cnica Assistida por IA

A IA pode executar apenas tarefas formais e instrumentais, incluindo:

- DetecÃƒÂ§ÃƒÂ£o de similaridade textual (plÃƒÂ¡gio)
- VerificaÃƒÂ§ÃƒÂ£o de estrutura acadÃƒÂªmica mÃƒÂ­nima
- AnÃƒÂ¡lise de coerÃƒÂªncia textual bÃƒÂ¡sica
- IdentificaÃƒÂ§ÃƒÂ£o de referÃƒÂªncias inconsistentes ou ausentes
- GeraÃƒÂ§ÃƒÂ£o de relatÃƒÂ³rios auxiliares para revisores humanos

A IA **nÃƒÂ£o emite parecer cientÃƒÂ­fico final**.

---

### 2. AvaliaÃƒÂ§ÃƒÂ£o CientÃƒÂ­fica Humana

A avaliaÃƒÂ§ÃƒÂ£o de mÃƒÂ©rito cientÃƒÂ­fico ÃƒÂ© realizada por revisores humanos qualificados e inclui:

- Validade metodolÃƒÂ³gica
- ConsistÃƒÂªncia lÃƒÂ³gica e matemÃƒÂ¡tica
- Originalidade conceitual
- RelevÃƒÂ¢ncia para a ÃƒÂ¡rea de conhecimento
- AderÃƒÂªncia a princÃƒÂ­pios ÃƒÂ©ticos de pesquisa

Somente humanos podem decidir aceitaÃƒÂ§ÃƒÂ£o, rejeiÃƒÂ§ÃƒÂ£o ou solicitaÃƒÂ§ÃƒÂ£o de revisÃƒÂµes substanciais.

---

## CritÃƒÂ©rios CientÃƒÂ­ficos Fundamentais

Cada submissÃƒÂ£o deve ser analisada segundo os seguintes eixos:

### A. Metodologia
- Clareza do mÃƒÂ©todo
- Reprodutibilidade
- AdequaÃƒÂ§ÃƒÂ£o estatÃƒÂ­stica ou lÃƒÂ³gica
- LimitaÃƒÂ§ÃƒÂµes explicitadas

### B. Originalidade
- ContribuiÃƒÂ§ÃƒÂ£o conceitual real
- NÃƒÂ£o trivialidade em relaÃƒÂ§ÃƒÂ£o ao estado da arte
- Justificativa clara do que ÃƒÂ© novo

### C. FundamentaÃƒÂ§ÃƒÂ£o
- Uso adequado de literatura relevante
- ReferÃƒÂªncias verificÃƒÂ¡veis
- EvitaÃƒÂ§ÃƒÂ£o de citaÃƒÂ§ÃƒÂµes decorativas

### D. CoerÃƒÂªncia Interna
- AusÃƒÂªncia de contradiÃƒÂ§ÃƒÂµes internas
- Encadeamento lÃƒÂ³gico consistente
- ConclusÃƒÂµes compatÃƒÂ­veis com os dados apresentados

### E. Ãƒâ€°tica e Integridade
- AusÃƒÂªncia de fabricaÃƒÂ§ÃƒÂ£o ou manipulaÃƒÂ§ÃƒÂ£o de dados
- DeclaraÃƒÂ§ÃƒÂ£o de conflitos de interesse quando aplicÃƒÂ¡vel
- Respeito a normas ÃƒÂ©ticas da ÃƒÂ¡rea

---

## O Que a Plataforma Explicitamente NÃƒÂ£o Faz

Para evitar falsas promessas tecnolÃƒÂ³gicas, o Datasphere Academic declara que:

- NÃƒÂ£o automatiza julgamento cientÃƒÂ­fico
- NÃƒÂ£o substitui revisÃƒÂ£o por pares humanos
- NÃƒÂ£o utiliza mÃƒÂ©tricas de popularidade como critÃƒÂ©rio de mÃƒÂ©rito
- NÃƒÂ£o tokeniza decisÃƒÂµes cientÃƒÂ­ficas como incentivo primÃƒÂ¡rio

---

## DiscordÃƒÂ¢ncia, ApelaÃƒÂ§ÃƒÂ£o e RevisÃƒÂ£o

Autores tÃƒÂªm direito a:

- Acesso aos relatÃƒÂ³rios gerados por IA
- Justificativas humanas documentadas
- SolicitaÃƒÂ§ÃƒÂ£o de nova rodada de revisÃƒÂ£o
- ContestaÃƒÂ§ÃƒÂ£o fundamentada de decisÃƒÂµes

Toda decisÃƒÂ£o deve ser acompanhada de justificativa registrada.

---

## EvoluÃƒÂ§ÃƒÂ£o dos CritÃƒÂ©rios

Os critÃƒÂ©rios cientÃƒÂ­ficos nÃƒÂ£o sÃƒÂ£o estÃƒÂ¡ticos.

Eles podem ser revisados por meio de:
- ComitÃƒÂªs cientÃƒÂ­ficos rotativos
- Consulta pÃƒÂºblica documentada
- Registro explÃƒÂ­cito de mudanÃƒÂ§as e suas motivaÃƒÂ§ÃƒÂµes

---

## TransparÃƒÂªncia

Este documento ÃƒÂ© pÃƒÂºblico, versionado e auditÃƒÂ¡vel.

Nenhum critÃƒÂ©rio implÃƒÂ­cito ou oculto ÃƒÂ© utilizado na avaliaÃƒÂ§ÃƒÂ£o de trabalhos submetidos ÃƒÂ  plataforma.

---

## Nota Final

A credibilidade cientÃƒÂ­fica da plataforma depende diretamente da clareza e do respeito a estes critÃƒÂ©rios.

A tecnologia deve aumentar o rigor cientÃƒÂ­fico, nunca substituÃƒÂ­-lo.
"@ -Encoding utf8

# Commit e push
git add docs/CRITERIA.md
git commit -m "Adiciona CRITERIA.md: critÃƒÂ©rios cientÃƒÂ­ficos explÃƒÂ­citos e separaÃƒÂ§ÃƒÂ£o formal IA x humano"
git push -u origin main --force
