# Jira MCP Server per Copilot CLI

Server MCP che permette a GitHub Copilot CLI di accedere automaticamente ai ticket Jira durante le conversazioni.

## Setup

### 1. Installa le dipendenze
```bash
cd jira-mcp-server
npm install
```

### 2. Configura Copilot CLI
Aggiungi il server MCP alla configurazione di Copilot CLI:

```bash
copilot
```

Poi nella sessione Copilot:
```
/mcp add jira
```

Quando richiesto, inserisci:
- **Command**: `node`
- **Args**: `C:\Users\giuseppe.danise\jira-mcp-server\index.js`
- **Env variables**:
  - `JIRA_EMAIL`: la tua email Jira
  - `JIRA_API_TOKEN`: il tuo API token Jira
  - `JIRA_URL`: https://generali-iiab.atlassian.net

### 3. Verifica
```
/mcp show
```

Dovresti vedere il server "jira" nell'elenco.

## Tool disponibili

Una volta configurato, Copilot potrà:

1. **jira_get_ticket**: Recuperare dettagli di un ticket specifico
   - Esempio: "Mostrami i dettagli del ticket IIAB-81069"

2. **jira_search_tickets**: Cercare ticket con JQL
   - Esempio: "Cerca tutti i ticket aperti nel progetto IIAB"
   - Esempio: "Trova i ticket con label backend"

3. **jira_get_my_tickets**: Vedere i ticket assegnati a te
   - Esempio: "Mostrami i miei ticket in corso"
   - Esempio: "Quali sono i miei ticket aperti?"

## Uso

Dopo la configurazione, puoi semplicemente chiedere a Copilot:

```
"Mostrami il ticket IIAB-81069"
"Cerca ticket aperti nel progetto IIAB"
"Quali sono i miei ticket in corso?"
"Trova ticket con priorità alta assegnati a me"
```

Copilot userà automaticamente gli strumenti Jira per rispondere!
