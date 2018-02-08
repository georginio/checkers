import openSocket from 'socket.io-client'

let socket = openSocket('http://localhost:3300')

// subscribers
let subscribeToMessage = cb => socket.on('message', (message) => cb(null, message))
let subscribeToNewUser = cb => socket.on('new-user', username => cb(null, username))

// emitters
let sendMessage = message => socket.emit('message', message)
let emitNewUser = username => socket.emit('new-user', username)

export {
    sendMessage,
    subscribeToMessage,
    emitNewUser,
    subscribeToNewUser
}

