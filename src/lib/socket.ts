import { io } from 'socket.io-client';

// Connect to the Express backend socket server
export const socket = io('http://localhost:3000');
