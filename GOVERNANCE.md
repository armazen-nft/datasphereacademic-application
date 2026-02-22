# Garantir que a pasta docs exista
if (!(Test-Path ".\docs")) {
    New-Item -ItemType Directory -Path ".\docs"
}

# Criar GOVERNANCE.md com codificação UTF-8 correta
Set-Content -Path ".\docs\GOVERNANCE.md" -Value @"
# Governança Científica – Datasphere Academic

Este documento define o modelo de governança do Datasphere Academic.

Seu objetivo é garantir que decisões científicas não sejam capturadas por automação acrítica, incentivos financeiros, popularidade ou arbitrariedade técnica.

A governança do sistema é orientada por princípios científicos, não por métricas de engajamento ou consenso algorítmico opaco.

---

## Princípios de Governança

O Datasphere Academic opera segundo os seguintes princípios fundamentais:

1. Primazia do julgamento científico humano
2. Transparência decisória
3. Responsabilidade explícita por decisões
4. Direito à contestação fundamentada
5. Evolução controlada e documentada das regras

---

## Estrutura de Governança

### 1. Comitê Científico

O Comitê Científico é o órgão máximo de decisão acadêmica da plataforma.

Composição:
- Pesquisadores humanos com experiência comprovada
- Diversidade de áreas do conhecimento
- Mandatos temporários e rotativos

Responsabilidades:
- Definir critérios científicos oficiais
- Supervisionar revisões complexas ou controversas
- Avaliar falhas sistêmicas de validação
- Autorizar mudanças estruturais nos critérios

Nenhuma IA faz parte do Comitê Científico.

---

### 2. Revisores Humanos

Revisores humanos são responsáveis pela avaliação de mérito científico.

Características:
- Atuação identificável dentro do sistema
- Histórico público de revisões
- Responsabilidade pelas decisões tomadas

Revisores podem:
- Aceitar trabalhos
- Rejeitar trabalhos
- Solicitar revisões
- Divergir entre si, desde que justificado

---

### 3. Papel da Inteligência Artificial

A Inteligência Artificial possui papel estritamente auxiliar.

Ela pode:
- Produzir relatórios técnicos
- Identificar padrões formais
- Sinalizar inconsistências
- Auxiliar revisores humanos

Ela não pode:
- Tomar decisões finais
- Vetar publicações
- Definir critérios científicos
- Participar de votações de governança

---

## Processo Decisório

### Fluxo padrão de decisão

1. Submissão do trabalho
2. Triagem técnica assistida por IA
3. Avaliação por revisores humanos
4. Consolidação da decisão
5. Registro da justificativa

Toda decisão deve ser acompanhada de justificativa textual clara.

---

## Discordância e Apelação

Autores têm direito a:

- Contestação fundamentada de decisões
- Solicitação de nova rodada de revisão
- Encaminhamento ao Comitê Científico em casos excepcionais

Nenhuma decisão é irrevogável sem possibilidade de revisão.

---

## Prevenção de Captura Sistêmica

Para evitar degradação da qualidade científica, o sistema adota:

- Rotatividade obrigatória de revisores
- Proibição de métricas de popularidade como critério decisório
- Auditoria periódica de decisões
- Registro histórico de mudanças de governança

---

## Evolução da Governança

Mudanças neste modelo só podem ocorrer mediante:

- Proposta documentada
- Justificativa científica explícita
- Avaliação do Comitê Científico
- Registro público da alteração

Governança não evolui por conveniência técnica, mas por necessidade científica.

---

## Transparência e Auditoria

Todos os processos de governança são:

- Documentados
- Versionados
- Auditáveis publicamente

A opacidade é considerada falha crítica do sistema.

---

## Nota Final

A credibilidade do Datasphere Academic depende mais da qualidade de sua governança do que de qualquer tecnologia utilizada.

Sem governança científica rigorosa, não existe validação acadêmica legítima.
"@ -Encoding utf8

# Commit e push
git add docs/GOVERNANCE.md
git commit -m "Adiciona GOVERNANCE.md: modelo explícito de governança científica e decisória"
git push -u origin main --force
