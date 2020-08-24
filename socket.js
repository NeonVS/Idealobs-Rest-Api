let io;

module.exports = {
    init:httpServer=>{
        io = require('socket.io')(httpServer);
        return io;
    },
    getIO:()=>{
        if(!io){
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
}

exports.socketConnection = socket =>{
    console.log('client connected');
    projectId = socket.handshake.projectId;
    socket.join(projectId);
    socket.on('disconnect',()=>{
        socket.leave(projectId);
    });
    socket.on('send_message',message=>{
        console.log(message);
    });
}