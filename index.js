const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

// =============== CLIENTE WHATSAPP =================

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

const ADMIN_NUMBER = '5521995294926@c.us';
const BOAS_VINDAS_IMAGEM_URL = 'https://raw.githubusercontent.com/Vinicios2j/imgs/refs/heads/main/bot.jpg';
const OPA_GROUP_ID = '120363398598316679@g.us';

const userStates = {};
const userLastAttendanceDate = {};

function getTodayDate() {
    const now = new Date();
    return now.toISOString().slice(0, 10);
}

function gerarSenhaAleatoria() {
    const numero = Math.floor(100 + Math.random() * 900);
    return `AG-${numero}`;
}

function formatMessage(text) {
    return `*BOT - AG*\n\n${text}`;
}

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Leia o QR Code com seu celular para conectar o WhatsApp.');
});

client.on('ready', () => {
    console.log('Bot de WhatsApp conectado e pronto!');
});

client.on('message', async msg => {
    if (msg.fromMe) return;

    const chat = await msg.getChat();
    if (chat.isGroup) return;

    const userId = msg.from;
    const body = msg.body.trim();
    const lowerBody = body.toLowerCase();
    const today = getTodayDate();

    if (userLastAttendanceDate[userId] === today) return;

    if (!userStates[userId]) {
        userStates[userId] = {
            stage: 0,
            name: '',
            serviceType: '',
            details: '',
            lastMessage: ''
        };
    }

    const user = userStates[userId];
    if (user.lastMessage === body) return;
    user.lastMessage = body;

    if (msg.from === ADMIN_NUMBER) {
        if (lowerBody === 'reiniciar bot') {
            await client.sendMessage(ADMIN_NUMBER, formatMessage('Iniciando processo de reinicialização do sistema... Por favor, aguarde.'));
            try {
                await client.destroy();
                setTimeout(() => client.initialize(), 3000);
            } catch (err) {
                await client.sendMessage(ADMIN_NUMBER, formatMessage(`❌ Erro ao reiniciar o bot: ${err.message}`));
            }
            return;
        }

        if (lowerBody.startsWith('finalizar atendimento')) {
            const id = lowerBody.replace('finalizar atendimento', '').trim();
            if (userStates[id]) {
                delete userStates[id];
                await client.sendMessage(id, formatMessage('Informamos que o seu atendimento foi finalizado. Caso precise de um novo suporte, basta nos enviar uma nova mensagem.'));
                await client.sendMessage(ADMIN_NUMBER, formatMessage(`✅ Atendimento do usuário ${id} finalizado com êxito.`));
            } else {
                await client.sendMessage(ADMIN_NUMBER, formatMessage(`❌ Não foi possível localizar um atendimento ativo para o usuário informado: "${id}". Verifique se o ID está correto (ex: 5521999999999@c.us).`));
            }
            return;
        }
    }

    switch (user.stage) {
        case 0:
            try {
                const media = await MessageMedia.fromUrl(BOAS_VINDAS_IMAGEM_URL);
                await client.sendMessage(userId, media, {
                    caption: formatMessage('Olá, tudo bem? Aqui quem fala é o assistente virtual da *AG Álvaro Genuíno*. Para iniciarmos seu atendimento de excelência, por favor, informe seu nome completo.')
                });
            } catch {
                await client.sendMessage(userId, formatMessage('Olá, tudo bem? Aqui quem fala é o assistente virtual da *AG Álvaro Genuíno*. Para iniciarmos seu atendimento de excelência, por favor, informe seu nome completo. (Obs: não foi possível carregar a imagem de boas-vindas)'));
            }
            user.stage = 1;
            break;

        case 1:
            user.name = body;
            await client.sendMessage(userId, formatMessage(`Excelente, ${user.name}! Para direcionarmos seu atendimento com a máxima precisão, selecione a categoria de serviço que melhor se alinha à sua necessidade:\n\n1. 🏠 *Elétrica Residencial*\n2. 🏢 *Elétrica Predial*\n3. 🏭 *Elétrica Industrial*\n4. 👨‍💼 *Quero falar com um atendente*\nPor favor, digite apenas o número correspondente à opção desejada.`));
            user.stage = 2;
            break;

        case 2:
            const op = parseInt(body);
            if (![1, 2, 3, 4].includes(op)) {
                await client.sendMessage(userId, formatMessage('Opção inválida. Por favor, digite apenas o número 1, 2, 3 ou 4.'));
                return;
            }

            if (op === 4) {
                const senha = gerarSenhaAleatoria();
                const numeroLimpo = userId.replace('@c.us', '');
                const avisoGrupo = `🚨 *SOLICITAÇÃO DE ATENDIMENTO HUMANO URGENTE*\n\nUsuário: *${user.name}* - ${numeroLimpo}\nSenha de Atendimento: *${senha}*\n\nO usuário solicitou suporte com um atendente humano.`;

                await client.sendMessage(userId, formatMessage(`Tudo certo! Estamos enviando sua solicitação para um atendente.\n\nSua senha de atendimento é: *${senha}*\nAguarde nosso contato!`));

                try {
                    await client.sendMessage(OPA_GROUP_ID, avisoGrupo);
                } catch (e) {
                    console.error('Erro ao enviar mensagem para grupo:', e);
                }

                userLastAttendanceDate[userId] = today;
                delete userStates[userId];
                return;
            }

            user.serviceType = ['Elétrica Residencial', 'Elétrica Predial', 'Elétrica Industrial'][op - 1];
            await client.sendMessage(userId, formatMessage(`Ótimo! Você selecionou *${user.serviceType}*. Para que nossa equipe técnica possa preparar um atendimento personalizado e eficiente, por favor, descreva detalhadamente sua demanda ou o problema que precisa resolver. Quanto mais informações, melhor poderemos ajudá-lo!`));
            user.stage = 3;
            break;

        case 3:
            user.details = body;
            const numeroLimpo = userId.replace('@c.us', '');
            const resumo = `📢 NOVO ATENDIMENTO DE SUPORTE\n\nO usuário (${user.name} - ${numeroLimpo}) está com o seguinte problema:\n\n1. Tipo de Eletricidade: ${user.serviceType}\n2. Detalhes: "${user.details}"\n\nPor favor, entrem em contato com ele(a) para dar continuidade ao atendimento.`;

            try {
                await client.sendMessage(OPA_GROUP_ID, resumo);
            } catch (e) {
                console.error('Erro ao enviar para grupo:', e);
            }

            await client.sendMessage(userId, formatMessage('✅ Obrigado! Sua solicitação foi registrada com sucesso. Em breve, um de nossos especialistas da AG Álvaro Genuíno entrará em contato para dar sequência ao atendimento.'));

            userLastAttendanceDate[userId] = today;
            delete userStates[userId];
            break;
    }
});

client.initialize();

// =========================
// API HTTP PARA CONTROLE
// =========================

const db = new Map(); // Simulação de banco de dados em memória

app.use(express.json());

app.get('/api/status', (req, res) => {
    const status = db.get("botStatus") || "desligado";
    res.json({ status });
});

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
    console.log("🟢 API do Painel rodando em 80");
});
