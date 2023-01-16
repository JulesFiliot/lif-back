const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3006);
module.exports = {
    threadUpdate: (data) => {
        io.emit("thread/"+data.parent_id, data);
    }
}