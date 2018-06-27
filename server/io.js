const Game = require('./src/Game');
const User = require('./src/User');
const allGames = require('./src/AllGames');
const UserList = require('./src/UserList');

module.exports = (io, rooms) => {

    io.on('connection', (socket) => {

        socket.join('main');

        socket.on('disconnect', () => {
            const index = UserList.findUserIndex(socket.id);
            const gameIndex = allGames.findGameIndex(socket.id);

            if (gameIndex > -1) {
                const roomname = allGames.getRoomName(gameIndex);
                io.to(roomname).emit('disconnected-user');
                socket.leave(roomname);
            }

            if (index > -1) {
                socket.broadcast.emit('logout', UserList.getUser(index).id);
                UserList.removeUser(index);
            }
        });

        socket.on('message', (message) => socket.to('main').broadcast.emit('message', message));

        socket.on('private-message', (message) => {
            const game = allGames.findGame(socket.id);
            if (game) 
                socket.to(game.roomname).broadcast.emit('private-message', message);
        });

        socket.on('new-user', (username) => {
            // send full user list to new socket before adding new socket to the list
            const index = UserList.findUserIndexByUsername(socket.id, username);
            
            if (index !== -1) 
                return;
            
            io.to(socket.id).emit('all-users', UserList.getUsers())

            const user = new User(username, socket.id);
            UserList.addUser(user);

            socket.broadcast.emit('new-user', user);
        });

        // before game emitters 
        socket.on('play-invitation', (invitation) => {
            invitation.deliverer = socket.id;
            socket.to(invitation.id).emit('play-invitation', invitation);
        });

        socket.on('accept-invitation', ({ from, deliverer }) => {
            const { username, id } = deliverer;
            const roomName = from + username + Date.now().toString(); 

            rooms[roomName] = {
                player1: username,
                player2: from
            };
            socket.leave('main');
            socket.join(roomName);
            socket.to(id).emit('accepted-invitation', { from, roomName, deliverer: socket.id });

            const game = new Game(deliverer, { username: from, id: socket.id }, roomName);
            allGames.addGame(game);
        });

        socket.on('decline-invitation', (decline) => socket.to(decline.deliverer).emit('decline-invitation', decline));

        socket.on('join-room', ({ roomName, username }) => {
            socket.leave('main');
            socket.join(roomName);
            // strange way to give sides to players
            io.to(roomName).emit('game-start', { roomName, 'secondPlayer': username });
        })

        // after end game emitters
        socket.on('accept-replay', (id) => {
            const game = allGames.findGame(id);
            if (game)
                io.to(game.roomname).emit('restart-game')
        })

        socket.on('decline-replay', (id) => {
            socket.broadcast.emit('declined-replay');
            const index = allGames.findGameIndex(socket.id);
            
            // let client = io.sockets.adapter.rooms;
            // let io = io.sockets.connected;
            
            if (index > -1) {
                const roomname = allGames.getRoomName(index);
                
                Object.keys(io.sockets.adapter.rooms).forEach(name => {
                     if (name === roomname) {
                        const room = io.sockets.adapter.rooms[roomname];
                        Object.keys(room.sockets).forEach(socketId => {
                            const socket = io.sockets.connected[socketId];
                            socket.leave(roomname);
                            socket.join('main');
                        });
                    }
                });

                // socket.leave(roomname);
                // socket.join('main');
                allGames.removeGame(index);
            }
        });
        
        // listen for game emitters
        socket.on('check-move', (destination) => {
            const roomname = allGames.getRoomNameById(socket.id);
            
            if (roomname) 
                socket.to(roomname).broadcast.emit('check-move', destination);
        });

        socket.on('switch-turn', (turn) => {
            const roomname = allGames.getRoomNameById(socket.id);

            if (roomname) 
                socket.to(roomname).broadcast.emit('switch-turn', turn);
        });

        socket.on('end-game', (winner) => {
            const roomname = allGames.getRoomNameById(socket.id);

            if (roomname)
                socket.to(roomname).broadcast.emit('end-game', winner);
        });
       
    });
}
