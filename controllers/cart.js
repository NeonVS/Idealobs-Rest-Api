const mongoose = require('mongoose');
const Cart = require('../models/cart');
const {
    validationResult
} = require('express-validator');

exports.addItem = async (req, res, next) => {
    console.log('entered');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new Error(errors.errors[0].msg);
        error.statusCode = 422;
        return next(error);
    }
    try {
        const item = await Cart.findOne({
            creatorId: mongoose.Types.ObjectId(req.userId),
            cartItem: {
                $elemMatch: {
                    productId: mongoose.Types.ObjectId(req.body.productId)
                }
            }
        });
        if (item) {
            await Cart.findOneAndUpdate({
                creatorId: mongoose.Types.ObjectId(req.userId),
                cartItem: {
                    $elemMatch: {
                        productId: mongoose.Types.ObjectId(req.body.productId)
                    }
                }
            }, {
                $set: {
                    'cartItem.$.productId': mongoose.Types.ObjectId(req.body.productId),
                    'cartItem.$.quantity': parseFloat(req.body.quantity),
                    'cartItem.$.price': parseFloat(req.body.price)
                }
            });
            res.status(201).json({
                message: 'Success'
            });
        } else {
            let response;
            const doc = await Cart.findOne({
                creatorId: mongoose.Types.ObjectId(req.userId)
            });
            if (doc) {
                response = await Cart.findOneAndUpdate({
                    creatorId: mongoose.Types.ObjectId(req.userId)
                }, {
                    $push: {
                        cartItem: {
                            productId: req.body.productId,
                            quantity: parseFloat(req.body.quantity),
                            price: parseFloat(req.body.price)
                        }
                    }
                });
            } else {

                const cartItem = new Cart({
                    creatorId: req.userId,
                    cartItem: [{
                        productId: mongoose.Types.ObjectId(req.body.productId),
                        quantity: req.body.quantity,
                        price: req.body.price
                    }],
                });
                response = await cartItem.save();
            }

            res.status(201).json({
                message: 'Success',
                cartId: response._id
            });
        }
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
};

exports.getCartItems = async (req, res, next) => {
    try {
        const doc = await (await Cart.findOne({
            creatorId: req.userId
        }).populate('cartItem.productId')).execPopulate();
        res.status(200).json({
            cart: doc
        });
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
};

exports.deleteItem = async (req, res, next) => {
    console.log('delete request');
    try {
        await Cart.updateOne({
            creatorId: mongoose.Types.ObjectId(req.userId)
        }, {
            $pull: {
                cartItem: {
                    productId: mongoose.Types.ObjectId(req.body.productId)
                }
            }
        });
        res.status(200).json({message:'Deleted'});
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
};