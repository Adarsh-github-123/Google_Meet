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

//middlewares
app.set('view engine', 'ejs');
app.use("/public", express.static(path.join(__dirname, "static")));
app.use("/peerjs" , peerServer);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
});

server.listen(PORT, () => {
    console.log('Server is running');
})
