const Game = require('./src/Game');
const games = [];
module.exports = (io, users, rooms, redisClient) => {

    io.on('connection', (socket) => {

        socket.join('main');

        socket.on('disconnect', () => {
            let index = users.findIndex(user => user.id === socket.id);
            let gameIndex = games.findIndex(game => game.player1.id === socket.id || game.player2.id === socket.id);

            if (gameIndex > -1) {
                let roomname = games[gameIndex].roomname;
                io.to(roomname).emit('disconnected-user');
                socket.leave(roomname);
            }

            if (index > -1) {
                socket.broadcast.emit('logout', users[index].id);
                users.splice(index, 1);
            }
        });

        socket.on('message', (message) => {
            socket.to('main').broadcast.emit('message', message)
        });

        socket.on('private-message', (message) => {
            let game = games.find(game => game.player1.id === socket.id || game.player2.id === socket.id);
            if (game) 
                socket.to(game.roomname).broadcast.emit('private-message', message);
        });

        socket.on('new-user', (username) => {
            // send all user list to new socket before adding new socket to the list
            let index = users.findIndex(user => user.id === socket.id || user.username === username)
            
            if (index !== -1) 
                return;
            
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
            socket.leave('main');
            socket.join(roomName);
            socket.to(id).emit('accepted-invitation', { from, roomName, deliverer: socket.id });

            let game = new Game(deliverer, { username: from, id: socket.id }, roomName);
            games.push(game);
        });

        socket.on('decline-invitation', (decline) => socket.to(decline.deliverer).emit('decline-invitation', decline));

        socket.on('join-room', ({ roomName, username }) => {
            socket.leave('main');
            socket.join(roomName);
            // strange way to give sides to players
            io.to(roomName).emit('game-start', { roomName, 'secondPlayer': username });
        })

        socket.on('left-room', () => {
            let game = games.find(game => game.player1.id === socket.id || game.player2.id == socket.id);
            if (game) {
                socket.leave(game.roomname);
                socket.join('main');
            }
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
            
            if (index > -1) {
                let room = games[index].roomname;
                socket.leave(room);
                socket.join(room);
                games.splice(index, 1);
            }
        });
        
        // listen for game emitters
        socket.on('check-move', (destination) => {
            let game = games.find(game => game.player1.id === socket.id || game.player2.id === socket.id);
            
            if (game) 
                socket.to(game.roomname).broadcast.emit('check-move', destination);

        });

        socket.on('switch-turn', (turn) => {
            let game = games.find(game => game.player1.id === socket.id || game.player2.id === socket.id);
            
            if (game) 
                socket.to(game.roomname).broadcast.emit('switch-turn', turn);
        });

        socket.on('end-game', (winner) => {
            let game = games.find(game => game.player1.id === socket.id || game.player2.id === socket.id);
            
            if (game)
                socket.to(game.roomname).broadcast.emit('end-game', winner);
        });
        
       
    });
}
