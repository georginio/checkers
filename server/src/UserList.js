class UserList {

    constructor() {
        this.users = [];
    }

    getUsers() {
        return this.users;
    }

    getUser(index) {
        return this.users[index];
    }

    findUserIndex (id) {
        return this.users.findIndex(user => user.id === id);
    }

    findUserIndexByUsername (id, username) {
        return this.users.findIndex(user => user.id === id || user.username === username);
    }

    findUserByUsername (username) {
        return this.users.find(user => user.username === username);
    }

    addUser (user) {
        return this.users.push(user);
    }

    removeUser (index) {
        return this.users.splice(index, 1);
    }

    removeUsers () {
        return this.users = [];
    }
}

const userList = new UserList();

module.exports = userList;