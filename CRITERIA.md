# Garantir que a pasta docs exista
if (!(Test-Path ".\docs")) {
    New-Item -ItemType Directory -Path ".\docs"
}

# Criar CRITERIA.md com codificação UTF-8 correta
Set-Content -Path ".\docs\CRITERIA.md" -Value @"
# Critérios de Avaliação Científica – Datasphere Academic

Este documento define de forma explícita os critérios de avaliação utilizados na plataforma Datasphere Academic.

Ele existe para evitar ambiguidade epistemológica, automação acrítica e substituição indevida de julgamento científico humano por algoritmos.

Nenhuma decisão final de mérito científico é tomada exclusivamente por Inteligência Artificial.

---

## Princípio Fundamental

A plataforma adota o seguinte princípio:

A Inteligência Artificial atua apenas como ferramenta de triagem técnica e apoio analítico.  
A avaliação de mérito científico é sempre humana ou híbrida, com predominância humana.

---

## Separação de Camadas de Avaliação

### 1. Triagem Técnica Assistida por IA

A IA pode executar apenas tarefas formais e instrumentais, incluindo:

- Detecção de similaridade textual (plágio)
- Verificação de estrutura acadêmica mínima
- Análise de coerência textual básica
- Identificação de referências inconsistentes ou ausentes
- Geração de relatórios auxiliares para revisores humanos

A IA **não emite parecer científico final**.

---

### 2. Avaliação Científica Humana

A avaliação de mérito científico é realizada por revisores humanos qualificados e inclui:

- Validade metodológica
- Consistência lógica e matemática
- Originalidade conceitual
- Relevância para a área de conhecimento
- Aderência a princípios éticos de pesquisa

Somente humanos podem decidir aceitação, rejeição ou solicitação de revisões substanciais.

---

## Critérios Científicos Fundamentais

Cada submissão deve ser analisada segundo os seguintes eixos:

### A. Metodologia
- Clareza do método
- Reprodutibilidade
- Adequação estatística ou lógica
- Limitações explicitadas

### B. Originalidade
- Contribuição conceitual real
- Não trivialidade em relação ao estado da arte
- Justificativa clara do que é novo

### C. Fundamentação
- Uso adequado de literatura relevante
- Referências verificáveis
- Evitação de citações decorativas

### D. Coerência Interna
- Ausência de contradições internas
- Encadeamento lógico consistente
- Conclusões compatíveis com os dados apresentados

### E. Ética e Integridade
- Ausência de fabricação ou manipulação de dados
- Declaração de conflitos de interesse quando aplicável
- Respeito a normas éticas da área

---

## O Que a Plataforma Explicitamente Não Faz

Para evitar falsas promessas tecnológicas, o Datasphere Academic declara que:

- Não automatiza julgamento científico
- Não substitui revisão por pares humanos
- Não utiliza métricas de popularidade como critério de mérito
- Não tokeniza decisões científicas como incentivo primário

---

## Discordância, Apelação e Revisão

Autores têm direito a:

- Acesso aos relatórios gerados por IA
- Justificativas humanas documentadas
- Solicitação de nova rodada de revisão
- Contestação fundamentada de decisões

Toda decisão deve ser acompanhada de justificativa registrada.

---

## Evolução dos Critérios

Os critérios científicos não são estáticos.

Eles podem ser revisados por meio de:
- Comitês científicos rotativos
- Consulta pública documentada
- Registro explícito de mudanças e suas motivações

---

## Transparência

Este documento é público, versionado e auditável.

Nenhum critério implícito ou oculto é utilizado na avaliação de trabalhos submetidos à plataforma.

---

## Nota Final

A credibilidade científica da plataforma depende diretamente da clareza e do respeito a estes critérios.

A tecnologia deve aumentar o rigor científico, nunca substituí-lo.
"@ -Encoding utf8

# Commit e push
git add docs/CRITERIA.md
git commit -m "Adiciona CRITERIA.md: critérios científicos explícitos e separação formal IA x humano"
git push -u origin main --force
