import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import https from 'https';
import http from 'https';
import path from 'path';
import fs from 'fs';

import { config } from 'dotenv';

import tigerspendRequestHandler from './tigerspend';
import { connections, validateToken, deleteRecordByToken } from './tokens';
import useSocketIO from './socket';

const app = express();
app.use(cors(), morgan('common'), express.static(__dirname + '/../public'));

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(
            './certs/privkey.pem'
        ),
        cert: fs.readFileSync('./certs/fullchain.pem'),
    },
    app
);

config();
useSocketIO(httpsServer);

/**
 * test.html is a test enviornment which allows for manual interaction with the server
 */
app.get('/', (req, res) => {
    res.redirect('/test.html');
});

/**
 * tigerspend.rit.edu doesn't support CORS OOTB :/
 * so we implement a sort of reverse-proxy here to pull the data and add cors headers
 * we will also handle declaring the dates to pull the data from. I guess it also makes
 * the client-side code more clean, so perks? Lol, I can't even with CORS sometimes.
 */
app.get('/data/:skey', tigerspendRequestHandler);

/**
 * This route will be called by tigerspend.rit.edu/login.php once the shibsession cookie
 * has been converted into an skey url param. tigerspend.rit.edu will also have a token
 * that we administered that will link it to a specific websocket. We will take that
 * skey url param and then emit it on the websocket associated with the token
 */
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

/**
 * Just a route to test if the server is up. It send's a meme I thought was funny
 */
app.get('/up', (req, res) =>
    res.sendFile(path.resolve(__dirname + '/../public/img/server_meme.jpg'))
);

/**
 * Accepts a token and will redirect the caller to the tigerspend SAML shib page,
 * but the redirect will be pointed to our callback route for handling once finished
 */
app.get('/:token', (req, res) => {
    const token = req.params.token;
    if (!validateToken(token)) return res.status(401).end('haha, nope');

    return res.redirect(
        `https://tigerspend.rit.edu/login.php?cid=105&wason=https://${req.get(
            'host'
        )}/callback?token=${token}`
    );
});

const PORT = process.env.PORT || 2020;
httpsServer.listen(PORT, () => console.log('listening on ' + PORT));

// force https lol
express().use((req, res, next) => {
    return res.redirect('https://' + req.headers['host'] + req.url);
}).listen(80, () => console.log('listning on 80'));
