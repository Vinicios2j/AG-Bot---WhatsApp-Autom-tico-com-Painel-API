# 🤖 AG Bot - WhatsApp Automático com Painel API

Seja bem-vindo ao AG Bot, um bot inteligente para atendimento via WhatsApp com autenticação, categorias de serviços, geração de senha para atendente humano e painel de controle via API REST. Ideal para pequenas e médias empresas que desejam automatizar o primeiro contato com o cliente.

⚠️ Este projeto possui um painel web de controle, porém ainda não está incluído neste repositório. Em breve será disponibilizado.

## 📸 Prévia do Bot em Ação
<img src="https://raw.githubusercontent.com/Vinicios2j/imgs/refs/heads/main/bot.jpg" width="400"/>

## 📦 Tecnologias Utilizadas
- Node.js
- whatsapp-web.js
- Express.js
- Puppeteer
- API REST Local
- Mensagens com MessageMedia
- QR Code terminal

## 🚀 Como Usar

### 1. Instalação
```bash
git clone https://github.com/seu-usuario/ag-bot.git
cd ag-bot
npm install
```

### 2. Inicialize o Bot
```bash
node index.js
```

Ao iniciar, será exibido um QR Code no terminal:

📱 Leia o QR Code com seu WhatsApp:

1. Abra o WhatsApp no seu celular.
2. Vá em Configurações → Dispositivos conectados.
3. Toque em Conectar um dispositivo.
4. Aponte a câmera para o QR Code gerado no terminal.

Isso vincula sua sessão do WhatsApp ao bot.

## ⚙️ Funcionalidades
✅ Atendimento automático com fluxo interativo  
✅ Geração de senha e alerta em grupo para atendimento humano  
✅ Identificação por nome e tipo de serviço  
✅ API REST para controle externo (`/api/status`)  
✅ Detecção e prevenção de mensagens duplicadas  
✅ Admin pode reiniciar ou finalizar atendimentos manualmente via WhatsApp  
✅ Envio de imagem de boas-vindas (opcional)  

## 👨‍💼 Comandos do Administrador

**Reiniciar o bot**  
Envie: `reiniciar bot`  
🔁 O bot reinicia após 3 segundos.

**Finalizar atendimento de um usuário**  
Envie: `finalizar atendimento 5521XXXXXXXX@c.us`  
(O número deve estar no formato do WhatsApp ID, ex: `552199999999@c.us`)

## 🌐 Painel de API (Futuro)

O projeto já conta com uma API REST simples para controle de status:

### Rotas disponíveis:

- `GET /api/status` → Consulta status atual (ligado/desligado)  
- `POST /api/status` → Atualiza status

#### Exemplo:
```json
{
  "status": "ligado"
}
```

Em breve será disponibilizado um painel visual para controlar os atendimentos e visualizações de log.

## 📂 Organização
```
📁 ag-bot
├── index.js
├── package.json
├── .gitignore
├── 📁 node_modules
├── 📁 session (gerada automaticamente)
├── 📁 images
│   └── bot.jpg
```
O diretório `session` é criado após o primeiro login — ele mantém sua sessão ativa mesmo após fechar o terminal.

## ✅ Requisitos

- Node.js >= 16
- Conexão com a internet estável
- Conta de WhatsApp
- Terminal com suporte para QR Code (ex: Windows Terminal, iTerm2)

---

## ✉️ Contato

Feito por José Vinicios  
🚀 Portfólio: [github.com/Vinicios2j](https://github.com/Vinicios2j)  
📲 WhatsApp: (inserir seu número opcional)

---

Se curtir, ⭐ dá uma estrela no repositório!
