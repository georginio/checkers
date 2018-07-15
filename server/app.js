const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socket = require('socket.io');
const cors = require('cors');

const initIO = require('./io');
const UserList = require('./src/UserList');

const port = process.env.PORT || 3300;
const server = app.listen(port, () => console.log('app is running on a port ' + port));
const io = socket.listen(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/api/username/check', (req, res) => {
    const { username } = req.body;
    const user = UserList.findUserByUsername(username);

    if (user)
        return res.status(200).json({ exists: true });
    
    return res.status(200).json({ exists: false });
});

app.get('/api/users/all', (req, res) => {
    res.status(200).json({ users: UserList.getAvailableUsers() });            
});

app.delete('/api/users/all', (req, res) => {
    UserList.removeUsers();
});

if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.resolve(__dirname, '../', 'client', 'build', 'static')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
    });
 } else {
     app.get('*', (req, res) => res.send('not found'));
 }


initIO(io);
