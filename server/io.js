module.exports = (io, users, redisClient) => {

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
            socket.to(invitation.id).emit('play-invitation', invitation)
        });

        socket.on('disconnect', () => {
            let index = users.findIndex(user => user.id === socket.id);

            if (index !== -1) {
                socket.broadcast.emit('logout', users[index].id);
                users.splice(index, 1);
            }

        });
        
    });
}
