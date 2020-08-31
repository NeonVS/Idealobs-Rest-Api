const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
    cartItem:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }
    ], 
    creatorId:{
        type:Schema.Types.ObjectId,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model('Cart',cartSchema);