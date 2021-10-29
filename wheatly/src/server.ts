import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import https from 'https';

import fs from 'fs';
import { config } from 'dotenv';
import { Socket, Server as SIOServer } from 'socket.io';

import handleDataFetch from './handleDataFetch';

const app = express();
app.use(cors(), morgan('common'), express.static(__dirname + '/../public'));

type Connection = {
    token: string;
    socket: Socket;
    ia: number; // issued at
};

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const TOKEN_LEN = 10;
const TOKEN_MAX_AGE = 2 * 60 * 1000; // 2 min

let connections: { [key: string]: Connection } = {};

config();

function generateToken(): string {
    let token = '';

    for (let i = 0; i < TOKEN_LEN; i++)
        token += CHARS.charAt(Math.floor(Math.random() * CHARS.length));

    return token;
}

function validateToken(token: string): boolean {
    return !!connections[token];
}

function deleteRecordByToken(token: string) {
    if (!connections[token]) return;
    connections[token].socket.emit('debug', `connection for ${token} closed`);
    connections[token].socket.disconnect();
    delete connections[token];
}

// cleanup expired records (run purge every second)

setInterval(() => {
    for (let token of Object.keys(connections)) {
        if (
            new Date().getTime() >
            new Date(connections[token].ia + TOKEN_MAX_AGE).getTime()
        ) {
            deleteRecordByToken(token);
        }
    }
}, 1 * 1000);

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(
            '/etc/letsencrypt/live/vps.erwijet.com/privkey.pem'
        ),
        cert: fs.readFileSync('/etc/letsencrypt/live/vps.erwijet.com/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/vps.erwijet.com/chain.pem'),
    },
    app
);

const io = new SIOServer(httpsServer, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    const token = generateToken();
    socket.emit('debug', 'new connection: ' + token);

    connections[token] = {
        token,
        socket,
        ia: new Date().getTime(),
    };

    socket.emit(
        'debug',
        'current connections: ' + Object.keys(connections).length
    );
    socket.send(token);
});

app.get('/', (req, res) => {
    res.redirect('/test.html');
});

// tigerspend.rit.edu doesn't support CORS OOTB :/
// so we implement a sort of reverse-proxy here to pull the data and add cors headers
// we will also handle declaring the dates to pull the data from
app.get('/data/:skey', handleDataFetch);

app.get('/callback', (req, res) => {
    const token = req.query.token as string;
    const skey = req.query.skey as string;

    if (token == '' || skey == '' || !validateToken(token))
        return res.status(400).end('bad request');

    connections[token].socket.emit('skey', { skey });
    deleteRecordByToken(token);
    res.setHeader('content-type', 'text/html');
    res.end(
        "<script>window.close();</script><p>You're all set! You can now close this page.</p>"
    );
});

app.get('/up', (req, res) => res.sendFile(__dirname + '/../public/server_meme.png'));

app.get('/:token', (req, res) => {
    const token = req.params.token;
    if (!validateToken(token)) return res.status(401).end('haha, nope');

    return res.redirect(
        `https://tigerspend.rit.edu/login.php?cid=105&wason=https://${req.get(
            'host'
       )}/callback?token=${token}`
    );

const PORT = process.env.PORT || 2020;
httpsServer.listen(PORT, () => console.log('listening on ' + PORT));
