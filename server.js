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

//joining a new meeting
app.get('/join', (req,res) => {
    res.redirect(
        url.format({
            pathname :  `/join/${uuidv4()}`,
            query: req.query
        })
    )
})

//For already existing meeting
app.get('/joinold/:meetingid', (req, res) => {
    res.redirect(
        url.format({
            pathname: req.params.meeting_id,
            query: req.query
        })
    )
})

//Joining a meeting room
app.get('/join/:rooms', (req,res) => {
    res.render("room", {roomid: req.params.rooms, Myname: req.query.name})
})

io.on("connection", (socket) => {
    socket.on("join-room", (roomid, name, id) => {
        socket.join(roomid);
        socket.to(roomid).broadcast.emit("user-connected", name, id);

        socket.on("tellName", (name) => {
            socket.to(roomid).broadcast.emit("AddName", name);
        });

        socket.on("disconnect", (id)=> {
            socket.to(roomid).broadcast.emit("user-disconnect", id)
        })
    })
})

server.listen(PORT, () => {
    console.log('Server is running');
})
