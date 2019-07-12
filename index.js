const express = require('express');
const app = express();
const port = 3000;
const viewsPath = __dirname + '/views/';
const watson = require('./controllers/watson');

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => res.sendFile(viewsPath + 'home.html'));

const server = app.listen(port, () => console.log(`Listening on port ${port}`));


const io = require('socket.io')(server);

io.on('connection', async function (socket) {

    const session = await watson.create().newSession();
    const beginning = await session.begin();
    socket.emit('chatbot msg', beginning);

    socket.on('send msg', async function (msg, callback) {

        socket.emit('own msg', msg);

        const response = await session.send(msg);
        socket.emit('chatbot msg', response);

        if (callback) {
            callback();
        }
    });

    socket.on('disconnect', function () {
        session.end();
    });
});