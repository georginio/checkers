module.exports = (io, users, redisClient) => {

    io.on('connection', (socket) => {

        socket.on('message', (message) => {
            socket.broadcast.emit('message', message);
        });

        socket.on('new-user', (username) => {
            let user = { username, id: socket.id }
            users.push(user)
            socket.broadcast.emit('new-user', user);
        });

        socket.on('disconnect', () => {
            let index = users.findIndex(user => user.id === socket.id);

            if (index !== -1) {
                socket.broadcast.emit('logout', users[index].id)
                users.splice(index, 1);
            }

        });
        
    });
}
