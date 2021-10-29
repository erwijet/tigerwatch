import { Socket } from 'socket.io';

export type Connection = {
    token: string;
    socket: Socket;
    ia: number; // issued at
};

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const TOKEN_LEN = 10;
const TOKEN_MAX_AGE = 2 * 60 * 1000; // 2 min

export let connections: { [key: string]: Connection } = {};

export function generateToken(): string {
    let token = '';

    for (let i = 0; i < TOKEN_LEN; i++)
        token += CHARS.charAt(Math.floor(Math.random() * CHARS.length));

    return token;
}

export function validateToken(token: string): boolean {
    return !!connections[token];
}

export function deleteRecordByToken(token: string) {
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
