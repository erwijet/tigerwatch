import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import https from 'https';
import http from 'http';
import path from 'path';
import fs from 'fs';

import { config } from 'dotenv';

import tigerspendRequestHandler from './tigerspend';

const app = express();
app.use(
    cors(),
    morgan('common'),
    cookieParser(),
    express.static(__dirname + '/../public')
);

app.use((_, res, next) => {
    res.setHeader('X-Powered-By', 'Your Companion Cube'); // ✌
    next();
});

config();

const server =
    process.env.ENV !== 'DEV'
        ? https.createServer(
              {
                  key: fs.readFileSync('./certs/privkey.pem'),
                  cert: fs.readFileSync('./certs/fullchain.pem'),
              },
              app
          )
        : http.createServer(app);

/**
 * Read from cookies and forward to /data/<skey>
 */
app.get('/data', (req, res) => {
    return res.redirect('/data/' + (req.cookies.skey ?? 'skey'));
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
 * has been converted into an skey url param. We set that skey as a cookie and send the user
 * back to the app
 */
app.get('/callback', (req, res) => {
    const skey = req.query.skey as string;

    if (skey == '') return res.status(400).end('bad request');
    res.cookie('skey', skey, { domain: '.tigerwatch.app' });

    res.end('<script>(() => { globalThis.location.href = "https://tigerwatch.app" })()</script>');
});

/**
 * Just a route to test if the server is up. It send's a meme I thought was funny
 */
app.get('/up', (req, res) =>
    res.sendFile(path.resolve(__dirname + '/../public/img/server_meme.jpg'))
);

const PORT = process.env.PORT || 2020;
server.listen(PORT, () => console.log('listening on ' + PORT));

// force https lol
if (process.env.ENV !== 'DEV' && process.env.ENV !== 'STAGING') {
    express()
        .use((req, res, next) => {
            if (process.env.ENV !== 'DEV')
                return res.redirect('https://' + req.headers['host'] + req.url);
        })
        .listen(80, () => console.log('listning on 80'));
}
