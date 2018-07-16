import openSocket from 'socket.io-client'

const PORT = process.env.PORT || 3300
let URL = null

if (process.env.NODE_ENV === 'production') 
	URL = `https://reactcheckers.herokuapp.com:${PORT}`
else
    URL = `http://localhost:${PORT}`
    
const socket = openSocket(URL)   

// subscribers
const subscribeToMessage = cb => socket.on('message', message => cb(null, message))
const subscribeToNewUser = cb => socket.on('new-user', user => cb(null, user))
const subscribeToUserLogOut = cb => socket.on('logout', id => cb(null, id))
const subscribeToAllUsers = cb => socket.on('all-users',users => cb(null, users))
const subscribeToInvitation = cb => socket.on('play-invitation', invitation => cb(null, invitation))
const subscribeToDeclinedInvitation = cb => socket.on('decline-invitation', decline => cb(null, decline))
const subscribeToAccpt = cb => socket.on('accepted-invitation', accept => cb(null, accept))
const subscribeToGameStart = cb => socket.on('game-start', options => cb(null, options))
const subscribeToDeclinedGame = cb => socket.on('declined-replay', () => cb(null))
const subscribeToRestartGame = cb => socket.on('restart-game', () => cb(null))
const subscribeToDisconnect = cb => socket.on('disconnected-user', () => cb(null))
const subscribeToBusyUsers = cb => socket.on('busy-users', userIds => cb(null, userIds));

//game subs
const subscribeToMove = cb => socket.on('check-move', moveObj => cb(null, moveObj))
const subscribeToSwitchTurn = cb => socket.on('switch-turn', turn => cb(null, turn))
const subscribeToEndGame = cb => socket.on('end-game', winner => cb(null, winner))
const subscribeToPrivateMessage = cb => socket.on('private-message', message => cb(null, message))

// emitters
const emitMessage = (message, privateMessage) => { 
    let event = 'message'

    if (privateMessage)
        event = 'private-message' 
        
    socket.emit(event, message) 
}
const emitNewUser = username => socket.emit('new-user', username)
const emitInvitation = invitation => socket.emit('play-invitation', invitation)
const emitDeclineInvitation = decline => socket.emit('decline-invitation', decline)
const emitAccept = accept => socket.emit('accept-invitation', accept)
const emitJoinRoom = room => socket.emit('join-room', room)
const emitDeclineReplay = opponentId => socket.emit('decline-replay', opponentId) 
const emitAcceptReplay = opponentId => socket.emit('accept-replay', opponentId)
const emitLeftoRoom = () => socket.emit('left-room');
// game emitters
const emitMove = data => socket.emit('check-move', data)
const emitSwitchTurn = turn => socket.emit('switch-turn', turn)
const emitEndGame = winner => socket.emit('end-game', winner)

const unsubscribeFrom = (event) => {
    if (Array.isArray(event)) 
        event.forEach(e => socket.removeListener(e));
    else 
        socket.removeListener(event);
} 

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
    subscribeToRestartGame,
    subscribeToDisconnect,
    subscribeToBusyUsers,
    // game subs
    subscribeToMove,
    subscribeToSwitchTurn,
    subscribeToEndGame,
    subscribeToPrivateMessage,
    // emits
    emitMessage,
    emitNewUser,
    emitInvitation,
    emitDeclineInvitation,
    emitAccept,
    emitJoinRoom,
    emitDeclineReplay,
    emitAcceptReplay,
    emitLeftoRoom,
    // game emits 
    emitMove,
    emitSwitchTurn,
    emitEndGame,
    unsubscribeFrom
}
