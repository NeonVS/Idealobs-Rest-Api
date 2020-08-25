const mongoose = require('mongoose');

const Message = require('./models/messages');

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
    },
    socketConnection: async (socket) =>{

    console.log('client connected');
    projectId = socket.handshake.projectId;
    socket.join(projectId);
    socket.on('disconnect',()=>{
        socket.leave(projectId);
    });
    socket.on('send_message',async (message)=>{
        console.log(message);
        const _message = new Message({
            projectId: mongoose.Types.ObjectId(message['projectId']),
            projectName:message['projectName'],
            senderId:mongoose.Types.ObjectId(message['senderId']),
            senderUsername:message['senderUsername'],
            text:message['text'],
            dateTime:message['dateTime'],
        });
        const response = await _message.save();
        console.log(response);
        socket.in(message['projectId']).emit('receive_message', {
            'projectId': message['projectId'],
            'projectName': message['projectName'],
            'senderUsername':message['senderUsername'],
            'senderId':message['senderId'],
            'dateTime':message['dateTime'],
            'text':message['text'],
        })
    });
    }
}

