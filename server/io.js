module.exports = (io, users, rooms, redisClient) => {

    io.on('connection', (socket) => {

        socket.on('message', (message) => {
            socket.broadcast.emit('message', message);
        });

        socket.on('new-user', (username) => {
            // send all user list to new socket before adding new socket to the list
            io.to(socket.id).emit('all-users', users)
            
            let user = { username, id: socket.id };
            users.push(user);
            socket.broadcast.emit('new-user', user);
        });

        socket.on('play-invitation', (invitation) => {
            invitation.deliverer = socket.id;
            socket.to(invitation.id).emit('play-invitation', invitation);
        });

        socket.on('accept-invitation', ({ username, deliverer }) => {
            let roomName = username + deliverer.username; 
            rooms[roomName] = {
                player1: deliverer.username,
                player2: username
            };
            socket.join(roomName);
            socket.to(deliverer.id).emit('accepted-invitation', { roomName });
        })

        socket.on('decline-invitation', (decline) => {
            socket.to(decline.deliverer).emit('decline-invitation', decline);
        });

        socket.on('join-room', (roomName) => {
            socket.join(roomName);
            io.to(roomName).emit('game-start');
        })

        socket.on('disconnect', () => {
            let index = users.findIndex(user => user.id === socket.id);

            if (index !== -1) {
                socket.broadcast.emit('logout', users[index].id);
                users.splice(index, 1);
            }

        });
        
    });
}
