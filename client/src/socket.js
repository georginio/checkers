import openSocket from 'socket.io-client';

let socket = openSocket('http://localhost:3300');

let subscribeToMessage = cb => socket.on('message', (message) => cb(null, message));
let sendMessage = message => socket.emit('message', message);

export {
    sendMessage,
    subscribeToMessage
};

