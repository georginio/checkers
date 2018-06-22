class AllGames {
    
    constructor() {
        this.games = [];
    }

    addGame(game) {
        return this.games.push(game);
    }

    removeGame(index) {
        return this.games.splice(index, 1);
    }

    findGame(id) {
        return this.games.find(game => game.player1.id === id || game.player2.id === id);
    }

    findGameIndex(id) {
        return this.games.findIndex(game => game.player1.id === id || game.player2.id === id);
    }

    getRoomNameById(id) {
        const gameIndex = this.findGameIndex(id); 
        return gameIndex > -1 ? this.getRoomName(gameIndex) : null;
    }

    getRoomName(index) {
        return this.games[index].roomname;
    }
}

module.exports = new AllGames();
