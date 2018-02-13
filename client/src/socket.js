import openSocket from 'socket.io-client'

let socket = openSocket('http://localhost:3300')

// subscribers
let subscribeToMessage = cb => socket.on('message', message => cb(null, message))
let subscribeToNewUser = cb => socket.on('new-user', user => cb(null, user))
let subscribeToUserLogOut = cb => socket.on('logout', id => cb(null, id))
let subscribeToAllUsers = cb => socket.on('all-users',users => cb(null, users))

// emitters
let emitMessage = message => socket.emit('message', message)
let emitNewUser = username => socket.emit('new-user', username)

export {
    emitMessage,
    subscribeToMessage,
    emitNewUser,
    subscribeToNewUser,
    subscribeToUserLogOut,
    subscribeToAllUsers
}

