const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    projectId:{
        type:Schema.Types.ObjectId,
        ref:'Project',
        required:true,
    },
    projectName:{
        type:String,
        required:true,
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    dateTime:{
        type:String,
        required:true
    },
    senderUsername:{
        type:String,
        ref:'User',
    },
    text:{
        type:String,
    }   
});

module.exports = mongoose.model('Message',messageSchema);