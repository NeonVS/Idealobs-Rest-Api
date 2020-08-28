const mongoose = require('mongoose');
const url = require('url');
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
    socketConnection: async (socket,newNamespace) =>{
    console.log('client connected');
    const projectId = socket.handshake.query.chatID;
    //socket.join(projectId);
    socket.join(newNamespace.split('-')[1]);
    socket.on('disconnect',()=>{
        console.log('disconnected');
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
        console.log(newNamespace);
        io.of(`${newNamespace}`).in(newNamespace.split('-')[1]).emit(`receive-message`, {
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

