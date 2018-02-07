module.exports = (io, redisClient) => {

    io.on('connection', (socket) => {

        socket.on('message', (message) => {
            socket.broadcast.emit('message', message);
        });

        socket.on('disconnect', () => console.log(socket.id, 'was disconnected'));
        
    });
}
