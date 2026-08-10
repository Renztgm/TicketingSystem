// src/lib/socket.js
import { io as ioClient } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';

// Store the socket on globalThis so Vite's HMR reload of this module
// doesn't wipe out the reference and silently orphan the old connection.
if (!globalThis.__appSocket) {
    const token = localStorage.getItem(TOKEN_KEY);
    globalThis.__appSocket = ioClient(API_BASE_URL, {
        auth: { token },
    });
}

export function getSocket() {
    return globalThis.__appSocket;
}