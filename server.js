const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { addBW, getAllBW, resetAll } = require('./dataStore');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.get('/bw', (req, res) => res.json(getAllBW()));
app.post('/bw', (req, res) => {
    const { user, value } = req.body;
    const added = addBW(user, value);
    if (added) io.emit('new-bw', { user, value });
    res.json({ success: added });
});
app.post('/reset', (req, res) => {
    resetAll();
    io.emit('reset');
    res.json({ success: true });
});

server.listen(3001, () => console.log('✅ Backend działa na http://localhost:3001'));
