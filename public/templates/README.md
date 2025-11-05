# 📋 Templates de Importação de Contatos

Este diretório contém templates para importação de contatos no sistema de campanhas do Manager ZuckZapGo.

## 📁 Arquivos Disponíveis

### 1. `contacts-individual.csv`
Template para importar **contatos individuais** do WhatsApp.

- **Formato JID**: `numero@s.whatsapp.net`
- **Exemplo**: `5511999999999@s.whatsapp.net`
- **Uso**: Contatos pessoais, clientes, leads

### 2. `contacts-groups.csv`
Template para importar **grupos** do WhatsApp.

- **Formato JID**: `grupoID@g.us`
- **Exemplo**: `120363123456789012@g.us`
- **Uso**: Grupos de equipe, comunidades, listas de distribuição

**Como obter o ID do grupo:**
1. Abra o grupo no WhatsApp Web
2. O ID está na URL do navegador (números após "chat/")
3. Adicione `@g.us` no final

### 3. `contacts-channels.csv`
Template para importar **canais e newsletters** do WhatsApp.

- **Formato JID**: `canalID@newsletter`
- **Exemplo**: `1234567890@newsletter`
- **Uso**: Canais oficiais, newsletters, broadcasts

### 4. `contacts-complete.csv`
Template completo com **todos os 11 tipos** de contatos suportados.

**Tipos incluídos:**
- ✅ INDIVIDUAL - Contatos individuais (`@s.whatsapp.net`)
- ✅ LID - Hidden User Server (`@lid`)
- ✅ GROUP - Grupos (`@g.us`)
- ✅ NEWSLETTER - Canais (`@newsletter`)
- ✅ BROADCAST - Listas de transmissão (`@broadcast`)
- ✅ STATUS - Status do WhatsApp (`status@broadcast`)
- ✅ BOT - Bots do WhatsApp (`@bot`)
- ✅ HOSTED - Servidores hospedados (`@hosted`)
- ✅ HOSTED_LID - Servidores LID hospedados (`@hosted.lid`)
- ✅ MESSENGER - Messenger Interop (`@msgr`)
- ✅ INTEROP - Interoperabilidade geral (`@interop`)

## 🚀 Como Usar

### Passo 1: Baixar o Template
1. Acesse a página de detalhes da sua lista de contatos
2. Clique no botão "Baixar Template"
3. Escolha o template adequado ao seu tipo de contato

### Passo 2: Preencher o Template
1. Abra o arquivo CSV em um editor de planilhas (Excel, Google Sheets, LibreOffice)
2. **NÃO remova a linha de cabeçalho** (primeira linha com nomes dos campos)
3. Preencha os dados dos contatos:
   - **JID** (obrigatório): WhatsApp JID completo no formato correto
   - **Name** (opcional): Nome do contato/grupo/canal
   - **PushName** (opcional): Nome de exibição (usado para contatos individuais)
   - **CustomFields** (opcional): Metadados em formato JSON

### Passo 3: Salvar o Arquivo
- Salve como **CSV (UTF-8)**
- Mantenha a extensão `.csv`
- Certifique-se que os dados estão corretamente formatados

### Passo 4: Importar
1. Na página da lista de contatos, clique em "Importar"
2. Selecione o arquivo CSV
3. Configure as colunas (JID, Name, etc.)
4. Clique em "Importar Contatos"

## 📝 Regras de Formatação

### JID (WhatsApp Jabber ID)

Cada tipo de contato tem um formato específico de JID:

```
INDIVIDUAL:    5511999999999@s.whatsapp.net
LID:           1234567890@lid
GROUP:         120363123456789012@g.us
NEWSLETTER:    1234567890@newsletter
BROADCAST:     1234567890@broadcast
STATUS:        status@broadcast (fixo)
BOT:           1234567890@bot
HOSTED:        1234567890@hosted
HOSTED_LID:    1234567890@hosted.lid
MESSENGER:     1234567890@msgr
INTEROP:       1234567890@interop
```

### CustomFields (Campos Personalizados)

Formato JSON válido entre aspas duplas:

```csv
"{""department"":""Sales"",""region"":""SP""}"
```

**Exemplos de uso:**
- Departamento e região
- Tags e categorias
- Níveis de prioridade
- Informações de segmentação
- Metadados customizados

## ⚠️ Validações Importantes

### O sistema valida automaticamente:

✅ **Formato do JID**: Verifica se está no padrão correto  
✅ **Duplicatas**: Não permite JIDs duplicados na mesma lista  
✅ **Número de telefone**: Valida formato (10-15 dígitos) para INDIVIDUAL  
✅ **ID de grupo**: Valida formato (18-20 dígitos começando com 120363)  
✅ **CustomFields**: Valida se é um JSON válido  

### Erros comuns:

❌ **JID sem sufixo**: `5511999999999` → Correto: `5511999999999@s.whatsapp.net`  
❌ **Sufixo errado**: `5511999999999@g.us` (grupo) → Correto para individual: `@s.whatsapp.net`  
❌ **Número inválido**: `123@s.whatsapp.net` → Mínimo 10 dígitos  
❌ **JSON mal formatado**: `{department: Sales}` → Correto: `"{""department"":""Sales""}"`  

## 💡 Dicas e Boas Práticas

### 1. Teste com poucos contatos primeiro
Antes de importar milhares de contatos, teste com 5-10 para verificar o formato.

### 2. Use nomes descritivos
Facilite a identificação futura dos contatos com nomes claros.

### 3. Organize por CustomFields
Use campos personalizados para segmentar e filtrar contatos depois:
```json
{"segment": "VIP", "interest": "technology", "region": "SP"}
```

### 4. Mantenha backups
Sempre mantenha uma cópia do arquivo original antes de importar.

### 5. Remova duplicatas
Verifique se não há JIDs repetidos no arquivo antes de importar.

### 6. Codificação UTF-8
Sempre salve o CSV em **UTF-8** para suportar caracteres especiais e acentos.

## 🔧 Ferramentas Recomendadas

### Editores de CSV:
- **Microsoft Excel** - Windows/Mac
- **Google Sheets** - Web (gratuito)
- **LibreOffice Calc** - Windows/Mac/Linux (gratuito)
- **VS Code** - Com extensão "Rainbow CSV"

### Validadores JSON:
- **JSONLint** - https://jsonlint.com/
- **JSON Formatter** - https://jsonformatter.org/

## 📊 Limites e Capacidade

- ✅ **Contatos por importação**: Ilimitado
- ✅ **Tamanho do arquivo**: Até 50MB
- ✅ **Tipos de JID**: Todos os 11 tipos suportados
- ✅ **Validação**: Automática e em tempo real

## 🆘 Suporte

Se encontrar problemas durante a importação:

1. Verifique se o arquivo está no formato CSV UTF-8
2. Confirme que todos os JIDs estão no formato correto
3. Valide o JSON dos CustomFields
4. Verifique os logs de importação para detalhes dos erros
5. Entre em contato com o suporte técnico se necessário

## 📚 Documentação Técnica

Para mais informações sobre o formato JID e tipos de contato:
- [Documentação whatsmeow](https://github.com/tulir/whatsmeow)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

---

**Manager ZuckZapGo** - Sistema de Gestão WhatsApp  
Versão 1.4.0+
