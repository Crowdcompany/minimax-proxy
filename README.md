# MiniMax Proxy

Ein Express.js basierter Proxy-Server für die MiniMax AI API mit vollständiger CORS-Unterstützung für Frontend-Anwendungen.

**🔑 WICHTIG:** Dieser Proxy verwendet ein **fest eingestelltes KI-Modell** (`minimax-m2.1`). Clients benötigen **keinen eigenen MiniMax API-Key**.

## Live-Deployment

**Basis-URL:** `https://mmproxy.ccpn.cc`
**Status:** ✅ Live und funktional

## API-Endpunkt

### POST `/v1/chat/completions`

Proxy-Endpunkt für MiniMax AI Chat Completions API.

#### Vollständige URL
```
https://mmproxy.ccpn.cc/v1/chat/completions
```

*(Lokale Entwicklung: PORT-Umgebungsvariable muss gesetzt sein)*

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Deine Nachricht hier"
    }
  ]
}
```

**💡 Hinweis:** Der `model` Parameter ist optional und wird ignoriert. Der Proxy verwendet immer das fest konfigurierte Modell `minimax-m2.1`.

#### Response
Standard MiniMax API Response im JSON-Format (OpenAI-kompatibel).

## Frontend-Integration

### JavaScript Fetch Example
```javascript
async function sendMessage(prompt) {
  try {
    const response = await fetch('https://mmproxy.ccpn.cc/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Verwendung
sendMessage("Hallo, wie geht es dir?")
  .then(response => {
    console.log(response.choices[0].message.content);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Axios Example
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://mmproxy.ccpn.cc',
  headers: {
    'Content-Type': 'application/json'
  }
});

async function sendMessage(prompt) {
  try {
    const response = await apiClient.post('/v1/chat/completions', {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}
```

## CORS-Unterstützung

Der Proxy unterstützt vollständig CORS für alle Domains:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

## Features

- ✅ **Kein API-Key erforderlich** - Proxy übernimmt die Authentifizierung
- ✅ **Fest konfiguriertes Modell** - `minimax-m2.1` (Advanced reasoning)
- ✅ **Vollständige CORS-Unterstützung** für Web-Anwendungen
- ✅ **Robuste Fehlerbehandlung** mit strukturierten Antworten
- ✅ **Direkter Proxy** zu MiniMax AI API
- ✅ **Einfache Integration** - nur Messages erforderlich
- ✅ **OpenAI-kompatibel** - gleiche API wie OpenRouter

## KI-Modell

**Fest konfiguriert:** `minimax-m2.1`

- ✅ **Advanced reasoning** - Starke Problemlösungsfähigkeiten
- ✅ **OpenAI-kompatibel** - Standard Chat Completions Format
- ✅ **Keine Modell-Auswahl nötig** - automatisch verwendet
- ❌ **Nicht änderbar** über die API

## MiniMax API Besonderheiten

### Unterstützte Parameter
- `messages` - Chat-Nachrichten (erforderlich)
- `model` - KI-Modell (wird überschrieben)
- `temperature` - Kreativität (0.0-1.0, Standard: 1.0)
- `max_tokens` - Maximale Token-Antwort
- `stream` - Streaming-Antworten (boolean)

### Nicht unterstützte Parameter
- `presence_penalty` - Wird ignoriert
- `frequency_penalty` - Wird ignoriert
- `logit_bias` - Wird ignoriert
- `n` - Nur Wert 1 unterstützt
- `function_call` - Deprecated, bitte `tools` verwenden

### Besondere Features
- `reasoning_split: true` - Zeigt Denkprozess der KI an

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Server starten (PORT-Umgebungsvariable erforderlich)
PORT=3000 node index.js

# Mit Docker
docker build -t minimaxproxy .
docker run -e OPENAI_API_KEY=your_key -e PORT=3000 minimaxproxy
```

## Umgebungsvariablen

- `OPENAI_API_KEY`: Dein MiniMax API-Schlüssel (auf dem Server bereits konfiguriert)
- `PORT`: Server-Port (wird von Platform gesetzt, z.B. 80/443 für HTTP/HTTPS)

## Fehlerbehandlung

Bei Fehlern gibt der Proxy strukturierte JSON-Antworten zurück:

```json
{
  "error": "Beschreibung des Fehlers"
}
```

## Test-Frontend

Im `MiniMaxProxyFrontend` Ordner findest du ein vollständiges Test-Frontend mit HTML, CSS und JavaScript:

```bash
cd MiniMaxProxyFrontend
python3 -m http.server 8001
# Öffne http://localhost:8001 im Browser
```

## Support

Bei Problemen oder Fragen erstelle ein Issue im Repository oder kontaktiere den Administrator.

## MiniMax vs. OpenRouter

| Feature | MiniMax Proxy | OpenRouter Proxy |
|---------|---------------|------------------|
| Modell | minimax-m2.1 | z-ai/glm-4.5-air:free |
| API | api.minimax.io | openrouter.ai |
| Kompatibilität | OpenAI-kompatibel | OpenAI-kompatibel |
| Reasoning | Advanced | Standard |
