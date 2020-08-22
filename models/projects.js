const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const projectSchema = new Schema({
    projectName:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    numColabs:{
        type:Number,
        required:true
    },
    budget:{
        type:Number,
        required:true,
    },
    amountPayable:{
        type:Number,
        required:true,
    },
    intro:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    dateTime:{
        type:String,
        required:true
    },
    youtubeUrl:{
        type:String,
    },
    imageUrl:{
        type:String,
        required:true
    },
    documentUrl:{
        type:String,
        required:true
    },
    categories:[
        {
            type:String,
            required:true
        }
    ],
    likes:{
        type:Number,
        default:0
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model('Project',projectSchema);