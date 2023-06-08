const express = require('express');
const app = express();
const server = require('http').Server(app);

const {v4 : uuidv4} = require('uuid');
const url = require('url');
const path = require('path');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

require('dotenv').config();

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log('Server is running');
})
