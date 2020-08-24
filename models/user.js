const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    emailToken:{
        type:Number,
    },
    password:{
        type:String,
    },
    token:{
        type:String,
    },
    verified:{
        type:Boolean,
        default:false
    },
    name:{
        type:String,
    },
    username:{
        type:String,
    },
    imageUrl:{
        type:String,
    },
    description:{
        type:String,
    },
    gender:{
        type:String,
    },
    enrolledProjects:[
        {
            type:Schema.Types.ObjectId,
            ref:'Project'
        }
    ],
},{timestamps:true});

module.exports = mongoose.model('User',userSchema);