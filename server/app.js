const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socket = require('socket.io');
const cors = require('cors');

const initIO = require('./io');

const port = process.env.PORT || 3300;
const server = app.listen(port, () => console.log('app is running on a port ' + port));
const io = socket.listen(server);

const activeUsers = [];
const rooms = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/api/username/check', (req, res) => {
    let { username } = req.body;
    let user = activeUsers.find(user => user.username === username);

    if (user)
        return res.status(200).json({ exists: true });
    
    return res.status(200).json({ exists: false });
});

app.get('/api/users/all', (req, res) => {
    res.status(200).json({ users: activeUsers });            
});

app.delete('/api/users/all', (req, res) => {
    activeUsers = [];
})

app.get('*', (req, res) => res.send('not found'));

initIO(io, activeUsers, rooms);
