const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socket = require('socket.io')
const redis = require('redis');
const cors = require('cors');

const initIO = require('./io');

const port = 3300;
const server = app.listen(port, () => console.log('app is running on a port ' + port));
const io = socket.listen(server);
const client = redis.createClient();
client.on('connect', () => console.log('redis connected...'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/api/username/save', (req, res) => {
    let { username } = req.body;

    client.rpush(['users', username], (err, reply) => {
        if (err)
            return res.status(500).send('Internal server error');
        res.status(200).send('username saved succesfully');
    });
    
});

app.post('/api/username/check', (req, res) => {
    let { username } = req.body;
    
    client.lrange('users', 0, -1, (err, reply) => {

        if (err) 
            return res.status(500).send('Internal server error');
        
        if (reply && reply.length > 0 && reply.includes(username))
            return res.status(200).json({ exists: true });
        
        return res.status(200).json({ exists: false });
    });
    
});

app.get('/api/users/all', (req, res) => {
    client.lrange('users', 0, -1, (err, reply) => {
        if (err)
            return res.status(500).send('Internal server error');
        res.status(200).json({ users: reply });            
    });
});

app.get('*', (req, res) => res.send('olaa negro'));

initIO(io, client);
