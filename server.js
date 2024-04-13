import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from "socket.io"

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

const users = {}

io.on('connection', (socket) => {
    // New user (client) joined
    socket.on("new-user", (username) => {
        users[socket.id] = username
        socket.broadcast.emit('user-connected', username)
    })

    // Emit messages to everyone
    socket.on('send-chat-message', (msg) => {
      socket.broadcast.emit('chat-message', { msg: msg, username: users[socket.id] });
    });

    // Disconnect
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    });
});



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});