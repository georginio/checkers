import openSocket from 'socket.io-client'

let socket = openSocket('http://localhost:3300')

// subscribers
let subscribeToMessage = cb => socket.on('message', message => cb(null, message))
let subscribeToNewUser = cb => socket.on('new-user', user => cb(null, user))
let subscribeToUserLogOut = cb => socket.on('logout', id => cb(null, id))
let subscribeToAllUsers = cb => socket.on('all-users',users => cb(null, users))
let subscribeToInvitation = cb => socket.on('play-invitation', invitation => cb(null, invitation))
let subscribeToDeclinedInvitation = cb => socket.on('decline-invitation', decline => cb(null, decline))
let subscribeToAccpt = cb => socket.on('accepted-invitation', accept => cb(null, accept))
let subscribeToGameStart = cb => socket.on('game-start', options => cb(null, options))
let subscribeToDeclinedGame = cb => socket.on('declined-replay', () => cb(null))

//game subs
let subscribeToMove = cb => socket.on('check-move', moveObj => cb(null, moveObj))
let subscribeToSwitchTurn = cb => socket.on('switch-turn', turn => cb(null, turn))
let subscribeToEndGame = cb => socket.on('end-game', winner => cb(null, winner))

// emitters
let emitMessage = message => socket.emit('message', message)
let emitNewUser = username => socket.emit('new-user', username)
let emitInvitation = invitation => socket.emit('play-invitation', invitation)
let emitDeclineInvitation = decline => socket.emit('decline-invitation', decline)
let emitAccept = accept => socket.emit('accept-invitation', accept)
let emitJoinRoom = room => socket.emit('join-room', room)
let emitDeclineReplay = () => socket.emit('decline-replay') 
// game emitters
let emitMove = data => socket.emit('check-move', data)
let emitSwitchTurn = turn => socket.emit('switch-turn', turn)
let emitEndGame = winner => socket.emit('end-game', winner)

export {
    // subs
    subscribeToMessage,
    subscribeToNewUser,
    subscribeToUserLogOut,
    subscribeToAllUsers,
    subscribeToInvitation,
    subscribeToDeclinedInvitation,
    subscribeToAccpt,
    subscribeToGameStart,
    subscribeToDeclinedGame,
    // game subs
    subscribeToMove,
    subscribeToSwitchTurn,
    subscribeToEndGame,
    // emits
    emitMessage,
    emitNewUser,
    emitInvitation,
    emitDeclineInvitation,
    emitAccept,
    emitJoinRoom,
    emitDeclineReplay,
    // game emits 
    emitMove,
    emitSwitchTurn,
    emitEndGame
}

