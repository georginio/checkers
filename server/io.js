module.exports = (io, redisClient) => {

    io.on('connection', (socket) => {

        socket.on('message', (message) => {
            socket.broadcast.emit('message', message);
        });

        socket.on('new-user', (user) => {

            redisClient.rpush(['users', user], (err, reply) => {
                if (!err)
                    socket.broadcast.emit('new-user', user);
            });
        });

        socket.on('disconnect', () => console.log(socket.id, 'was disconnected'));
        
    });
}
