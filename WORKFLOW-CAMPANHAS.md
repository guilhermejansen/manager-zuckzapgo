# Workflow de Campanhas - Sistema de Gerenciamento

## 📋 Visão Geral

Este documento explica como funciona o sistema de campanhas do ZuckZapGo Manager, desde a criação até a execução.

---

## 🔄 Ciclo de Vida de uma Campanha

### 1. Status das Campanhas

As campanhas podem ter os seguintes status:

#### **DRAFT (Rascunho)** 
- **Cor**: Cinza (outline)
- **Descrição**: Campanha recém-criada ou em edição
- **Ações Disponíveis**:
  - ✅ Editar
  - ✅ Deletar
  - ✅ Iniciar (se tudo configurado)
- **Explicação**: **TODAS** as campanhas começam como DRAFT ao serem criadas. Este é o status padrão e esperado!

#### **SCHEDULED (Pendente/Agendada)**
- **Cor**: Amarelo
- **Descrição**: Campanha agendada para execução futura (tipo SCHEDULED)
- **Ações Disponíveis**:
  - ✅ Cancelar
  - ❌ Editar (bloqueado)
- **Quando aparece**: Após iniciar uma campanha do tipo "Agendada" com data/hora futura

#### **RUNNING (Em Execução)**
- **Cor**: Verde
- **Descrição**: Campanha sendo executada no momento
- **Ações Disponíveis**:
  - ✅ Pausar
  - ✅ Cancelar
  - ❌ Editar (bloqueado)
  - ❌ Deletar (bloqueado)
- **Quando aparece**: Após clicar em "Iniciar" em uma campanha DRAFT

#### **PAUSED (Pausada)**
- **Cor**: Azul
- **Descrição**: Campanha pausada temporariamente
- **Ações Disponíveis**:
  - ✅ Iniciar (retomar)
  - ✅ Cancelar
  - ❌ Editar (bloqueado)
- **Quando aparece**: Após pausar uma campanha RUNNING

#### **COMPLETED (Concluída)**
- **Cor**: Cinza escuro
- **Descrição**: Campanha finalizada com sucesso
- **Ações Disponíveis**:
  - ✅ Deletar
  - ❌ Editar (bloqueado)
- **Quando aparece**: Quando todas as mensagens foram enviadas

#### **CANCELLED (Cancelada)**
- **Cor**: Cinza (outline)
- **Descrição**: Campanha cancelada pelo usuário
- **Ações Disponíveis**:
  - ✅ Deletar
  - ❌ Editar (bloqueado)
- **Quando aparece**: Após cancelar uma campanha RUNNING ou PAUSED

#### **FAILED (Falhou)**
- **Cor**: Vermelho
- **Descrição**: Campanha com erro crítico
- **Ações Disponíveis**:
  - ✅ Deletar
  - ❌ Editar (bloqueado)
- **Quando aparece**: Quando ocorre erro crítico na execução

---

## 🎯 Tipos de Campanhas

### 1. **SINGLE (Imediata)**
- **Descrição**: Envia mensagens assim que a campanha for iniciada
- **Quando usar**: Envios urgentes ou testes
- **Configuração necessária**:
  - Nome
  - Descrição
  - Lista de contatos
  - Workflow completo

### 2. **SCHEDULED (Agendada)**
- **Descrição**: Envia mensagens em uma data/hora específica
- **Quando usar**: Promoções programadas, lembretes
- **Configuração necessária**:
  - Nome
  - Descrição
  - Lista de contatos
  - **Data e hora de envio** (obrigatório)
  - Workflow completo

### 3. **RECURRING (Recorrente)**
- **Descrição**: Envia mensagens em intervalos programados usando expressões cron
- **Quando usar**: Newsletters, relatórios periódicos
- **Configuração necessária**:
  - Nome
  - Descrição
  - Lista de contatos
  - **Expressão Cron** (obrigatório)
  - Workflow completo
- **Exemplos de Cron**:
  - `0 9 * * 1-5` - Todo dia útil às 9h
  - `0 0 * * 0` - Todo domingo à meia-noite
  - `0 */6 * * *` - A cada 6 horas

---

## 📊 Fluxo Completo de Criação e Execução

```
1. CRIAR CAMPANHA
   └─> Status: DRAFT
       └─> Preencher nome, descrição, tipo
       └─> Selecionar lista de contatos
       └─> Configurar agendamento (se SCHEDULED/RECURRING)
       └─> Montar workflow visual
       └─> Clicar em "Criar Campanha"

2. EDITAR CAMPANHA (opcional - apenas DRAFT)
   └─> Status: DRAFT
       └─> Modificar qualquer configuração
       └─> Clicar em "Salvar Alterações"

3. INICIAR CAMPANHA
   └─> Status: DRAFT → RUNNING (ou SCHEDULED)
       └─> Sistema valida workflow
       └─> Cria jobs no BullMQ
       └─> Inicia envio de mensagens

4. MONITORAR EXECUÇÃO
   └─> Status: RUNNING
       └─> Acompanhar estatísticas em tempo real
       └─> Ver progresso de envio
       └─> Opções: Pausar ou Cancelar

5. FINALIZAÇÃO
   └─> Status: COMPLETED (sucesso) ou FAILED (erro)
       └─> Revisar relatórios
       └─> Deletar se não precisar mais
```

---

## ✅ Validações Importantes

### Ao Criar Campanha:
- ✅ Nome obrigatório (3-200 caracteres)
- ✅ Lista de contatos obrigatória
- ✅ Workflow deve ter:
  - Pelo menos 1 node de início (trigger.start)
  - Pelo menos 1 node de fim (control.end)
  - Pelo menos 1 mensagem
- ✅ Se tipo SCHEDULED: data/hora obrigatória
- ✅ Se tipo RECURRING: expressão cron obrigatória

### Ao Iniciar Campanha:
- ✅ Status deve ser DRAFT ou PAUSED
- ✅ Lista de contatos não pode estar vazia
- ✅ Workflow deve estar completo e válido

### Ao Editar Campanha:
- ✅ Apenas campanhas DRAFT podem ser editadas
- ❌ Campanhas RUNNING, SCHEDULED, PAUSED não podem ser editadas
  - **Solução**: Cancele e crie nova campanha

---

## 🔧 Funcionalidades de Gerenciamento

### Lista de Contatos
- **Caminho**: `/admin/campaigns/contacts`
- **Funcionalidades**:
  - Ver todas as listas de contatos
  - Criar nova lista
  - Editar lista existente
  - Adicionar/remover contatos
  - Importar contatos via CSV
  - Exportar contatos

### Workflow Editor
- **Tipos de Nodes Disponíveis**:
  - 🚀 **trigger.start** - Ponto de início
  - 💬 **message.text** - Mensagem de texto
  - 🖼️ **message.media** - Imagem, vídeo, documento
  - 🔘 **message.interactive** - Botões, listas
  - ⏱️ **control.delay** - Espera entre mensagens
  - 🏁 **control.end** - Ponto de fim

### Estatísticas em Tempo Real
- **Disponível durante execução (RUNNING)**:
  - Total de contatos
  - Mensagens enviadas
  - Mensagens entregues
  - Mensagens lidas
  - Mensagens com resposta
  - Taxa de sucesso
  - Tempo médio de entrega

---

## 🚀 Próximos Passos Sugeridos

### Para Implementar:

1. **Página de Gerenciamento de Listas de Contatos**
   - Criar `/admin/campaigns/contacts` (lista principal)
   - Implementar CRUD completo
   - Adicionar importação CSV

2. **Página de Adicionar Contatos à Lista**
   - Criar `/admin/campaigns/contacts/[id]/add`
   - Formulário manual
   - Importação em lote

3. **Relatórios Detalhados**
   - Dashboard de performance
   - Exportação de resultados
   - Histórico de campanhas

4. **Testes A/B**
   - Múltiplas variações de mensagem
   - Análise comparativa
   - Escolha automática do melhor resultado

---

## 🐛 Troubleshooting

### "Total de Contatos = 0"
- **Causa**: Lista de contatos vazia
- **Solução**: Adicione contatos à lista antes de iniciar

### "Não consigo editar campanha"
- **Causa**: Status não é DRAFT
- **Solução**: Apenas campanhas DRAFT podem ser editadas. Cancele e recrie se necessário.

### "Campanha sempre fica em DRAFT"
- **Causa**: **Este é o comportamento esperado!**
- **Solução**: Clique em "Iniciar" na página de detalhes para mudar o status

### "Não aparece o nome da lista de contatos"
- **Causa**: Relacionamento many-to-many não carregado
- **Solução**: Verificar se action getCampaignAction inclui contactLists

---

## 📝 Observações Importantes

1. **DRAFT é o status padrão**: Toda campanha criada começa como DRAFT. Isso permite revisar antes de enviar.

2. **Edição é restrita**: Apenas campanhas DRAFT podem ser editadas para evitar problemas durante execução.

3. **Listas de contatos são reutilizáveis**: Uma mesma lista pode ser usada em múltiplas campanhas.

4. **Workflow é visual**: Use o editor drag-and-drop para montar fluxos complexos.

5. **Estatísticas são em tempo real**: Durante execução (RUNNING), as stats atualizam via SSE (Server-Sent Events).

---

## 💡 Dicas de Uso

- ✅ Sempre teste com uma lista pequena primeiro
- ✅ Configure delays entre mensagens para não ser bloqueado
- ✅ Use fallback de instâncias para maior confiabilidade
- ✅ Monitore as estatísticas durante execução
- ✅ Revise o workflow antes de iniciar
- ✅ Para campanhas grandes, use tipo SCHEDULED para controlar horário
