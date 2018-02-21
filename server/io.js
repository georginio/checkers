const Game = require('./src/Game');
const games = [];
module.exports = (io, users, rooms, redisClient) => {

    io.on('connection', (socket) => {

        socket.on('disconnect', () => {
            let index = users.findIndex(user => user.id === socket.id);

            if (index !== -1) {
                socket.broadcast.emit('logout', users[index].id);
                users.splice(index, 1);
            }
        });

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

        // before game emitters 
        socket.on('play-invitation', (invitation) => {
            invitation.deliverer = socket.id;
            socket.to(invitation.id).emit('play-invitation', invitation);
        });

        socket.on('accept-invitation', ({ from, deliverer }) => {
            let { username, id } = deliverer;
            let roomName = from + username + Date.now().toString(); 
            
            rooms[roomName] = {
                player1: username,
                player2: from
            };
            socket.join(roomName);
            socket.to(id).emit('accepted-invitation', { from, roomName, deliverer: socket.id });

            let game = new Game(deliverer, { username: from, id: socket.id }, roomName);
            games.push(game);
        });

        socket.on('decline-invitation', (decline) => socket.to(decline.deliverer).emit('decline-invitation', decline));

        socket.on('join-room', ({ roomName, username }) => {
            socket.join(roomName);
            // strange way to give sides to players
            io.to(roomName).emit('game-start', { roomName, 'secondPlayer': username });
        })

        // after end game emitters
        socket.on('accept-replay', (id) => {
            let game = games.find(game => game.player1.id === id || game.player2.id == id);
            if (game)
                io.to(game.roomname).emit('restart-game')
        })

        socket.on('decline-replay', (id) => {
            socket.broadcast.emit('declined-replay');

            let index = games.findIndex(game => game.player1.id === id || game.player2.id == id);
            
            if (index > -1)
                games.splice(index, 1);
        });
        
        // listen for game emitters
        socket.on('check-move', (destination) => {
            socket.broadcast.emit('check-move', destination);
        });

        socket.on('switch-turn', (turn) => {
            socket.broadcast.emit('switch-turn', turn);
        });

        socket.on('end-game', (winner) => {
            socket.broadcast.emit('end-game', winner);
        });
        
       
    });
}
