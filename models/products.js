const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    info:{
        type:String,
        required:true
    },
    latitude:{
        type:Number,
        required:true,
    },
    longitude:{
        type:Number,
        required:true
    },
    address1:{
        type:String,
        required:true
    },
    address2:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    idea:{
        type:String,
        required:true
    },
    supplyExplanation:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    youtubeUrl:{
        type:String,
        required:true,
    },
    creatorId:{
        type:Schema.Types.ObjectId,
    }
},{timestamps:true});

module.exports = mongoose.model('Product',productSchema);