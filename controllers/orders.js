const mongoose = require('mongoose');
const Order = require('../models/orders');

const {
    validationResult
} = require('express-validator');

exports.addOrder = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new Error(errors.errors[0].msg);
        error.statusCode = 422;
        return next(error);
    }
    console.log(req.body);
    const elements = req.body;
    const orderItems = elements.map((element) => {
        return {
            'productId': element['productId'],
            'quantity': parseInt(element['quantity']),
            'price': parseFloat(element['price']),
        }
    });
    try {
        let response;
        orderItems.forEach(async (element) => {
            const order = new Order({
                productId: element['productId'],
                quantity: element['quantity'],
                price: element['price'],
                creatorId: mongoose.Types.ObjectId(req.userId)
            });
            await order.save();
        });
        res.status(201).json({
            message: 'Success',
        });
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
}

exports.getOrders = async (req,res,next)=>{
    try{
        const doc = await Order.find({creatorId:mongoose.Types.ObjectId(req.userId)}).populate({path:'productId',populate:{path:'productId'}});
        res.status(200).json({orders:doc});
    }catch(error){
        console.log(error);
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}