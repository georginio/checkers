class UserList {

    constructor() {
        this.users = [];
    }

    getUsers() {
        return this.users;
    }

    findUserIndex (id) {
        return this.users.findIndex(user => user.id === id);
    }

    findUserIndexByUsername (id, username) {
        return this.users.findIndex(user => user.id === id || user.username === username)
    }

    addUser (user) {
        return this.users.push(user);
    }

    removeUser (index) {
        return this.users.splice(index, 1);
    }
}

module.exports = new UserList();