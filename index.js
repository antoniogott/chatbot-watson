const express = require('express');
const app = express();
const port = 3000;
const viewsPath = __dirname + '/views/';

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => res.sendFile(viewsPath + 'home.html'));

const server = app.listen(port, () => console.log(`Listening on port ${port}`));


const io = require('socket.io')(server);

io.on('connection', function (socket) {

    socket.on('send msg', function (msg, callback) {

        socket.emit('own msg', msg);

        socket.emit('chatbot msg', 'Chatbot Oi');

        if (callback) {
            callback();
        }
    });
});