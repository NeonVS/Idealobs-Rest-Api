const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requestSchema = mongoose.Schema({
    from:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    projectId:{
        type:Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    officialEmail:{
        type:String,
        required:true,
    },
    info:{
        type:String,
        required:true,
    },
    reasonForProject:{
        type:String,
        required:true
    },
    cvUrl:{
        type:String,
        required:true
    }
    
});
module.exports = mongoose.model('Request',requestSchema);