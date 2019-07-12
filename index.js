const express = require('express');
const app = express();
const port = 3000;
const viewsPath = __dirname + '/views/';
const watson = require('./controllers/watson');
const dao = require('./controllers/cloudant-dao');

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => res.sendFile(viewsPath + 'home.html'));

const server = app.listen(port, () => console.log(`Listening on port ${port}`));


const io = require('socket.io')(server);

io.on('connection', async function (socket) {

    let ticket = {};
    let nextIsTitle = false;
    let nextContext;

    const session = await watson.create().newSession();
    const beginning = await session.begin();
    socket.emit('chatbot msg', beginning.text);

    socket.on('send msg', async function (msg, callback) {

        socket.emit('own msg', msg);

        if (callback) {
            callback();
        }

        if (nextIsTitle) {
            const resultado = await dao.findByTitle(msg);
            if (ticket.status) {
                socket.emit('chatbot msg', 'O status do seu ticket é: ' + ticket.status);
                nextIsTitle = false;
            }
            else {
                socket.emit('chatbot msg', 'Não encontrei nenhum ticket com este título. Tente novamente.');
            }
            return;
        }

        const response = await session.send(msg, nextContext);
        nextContext = null;

        socket.emit('chatbot msg', response.text);

        if (response.text === 'Claro! Me diga o título do ticket que deseja consultar.'
            || response.text === 'Ok! Só preciso do título do ticket que você quer consultar.'
            || response.text === 'Certo. Qual é o título do ticket que você deseja consultar?') {
            nextIsTitle = true;
        }

        if (response.context) {
            ticket.name = response.context.nome,
                ticket.problem = response.context.problema,
                ticket.title = response.context.titulo
        }
        if (ticket.name && ticket.problem && ticket.title) {
            ticket.status = 'Pendente';
            console.log('ticket', ticket);
            await dao.createTicket(ticket);
            ticket = {};

        }
    });

    socket.on('disconnect', function () {
        session.end();
    });
});