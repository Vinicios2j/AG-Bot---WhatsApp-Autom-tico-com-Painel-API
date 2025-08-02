const express = require('express');
const cors = require('cors');
const WioDB = require("wio.db");
const db = new WioDB.JsonDatabase({ databasePath: "./db.json" });

const app = express();
app.use(cors());
app.use(express.json());

// Retorna status atual
app.get('/api/status', (req, res) => {
    const status = db.get("botStatus") || "desligado";
    res.json({ status });
});

// Altera status
app.post('/api/status', (req, res) => {
    const { status } = req.body;

    if (!["ligado", "desligado"].includes(status)) {
        return res.status(400).json({ success: false, error: "Status inválido" });
    }

    db.set("botStatus", status);
    console.log(`[BOT] Status atualizado para: ${status}`);
    res.json({ success: true, newStatus: status });
});

app.listen(80, () => {
    console.log("🟢 API do Bot rodando em 80");
});
