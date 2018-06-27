class User {
    constructor(username, id) {
        this.username = username;
        this.id = id;
        this.isBusy = false;
    }

    setIsBusy (busy) {
        this.isBusy = busy;
    }

    isBusy () {
        return this.isBusy;
    } 
}

module.exports = User;
