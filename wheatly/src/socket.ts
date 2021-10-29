import type { Server as HttpsServer } from 'https';
import { Server as SIOServer } from 'socket.io';
import { connections, generateToken } from './tokens';

/**
 * Attaches a SocketIO websocket server to the specified https server
 *
 * @param server The underlying https server to attach the wss handler to
 */
export default function useSocketIO(server: HttpsServer): void {
    const io = new SIOServer(server, {
        cors: {
            origin: '*',
        },
    });

    /**
     * We handle incoming requests by establishing a ws connection and immediatly
     * issuing a unique token to that connection. On the server, we associate the open
     * connection with that token, so we can the skey data down that socket later on
     */
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
            'num active connections: ' + Object.keys(connections).length
        );
        socket.send(token);
    });
}
