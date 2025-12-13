require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const corsMiddleware = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Max-Age", "86400");

    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }
    next();
};

app.use(corsMiddleware);
app.use(express.json());

// Statische Dateien ausliefern (Frontend)
app.use(express.static('MiniMaxProxyFrontend'));

// Root-Route zur Frontend-HTML
app.get('/', (req, res) => {
    res.sendFile('simple_frontend.html', { root: 'MiniMaxProxyFrontend' });
});

// Models endpoint für n8n/OpenAI Kompatibilität
app.get('/v1/models', (req, res) => {
    res.json({
        object: "list",
        data: [
            {
                id: "minimax-m2",
                object: "model",
                created: 1765630262,
                owned_by: "minimax"
            }
        ]
    });
});

app.post('/v1/chat/completions', async (req, res) => {
    try {
        if (!req.body.model) {
            req.body.model = 'minimax-m2';
        }

        const response = await fetch('https://api.minimax.io/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.text();
        res.type('json').status(response.status).send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy server error' });
    }
});

app.listen(process.env.PORT);
