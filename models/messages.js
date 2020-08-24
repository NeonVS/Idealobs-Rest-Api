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
    messages:[
        {
            message:{
                senderId:{
                    type:Schema.Types.ObjectId,
                    ref:'User',
                },
                senderUsername:{
                    type:Schema.Types.ObjectId,
                    ref:'User',
                },
                text:{
                    type:String,
                }
            }
        }
    ]
});

module.exports = mongoose.model('Message',messageSchema);