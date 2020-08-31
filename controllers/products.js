const mongoose = require('mongoose');
const path = require('path');
const {validationResult} = require('express-validator');

const Product = require('../models/products');

exports.addProduct = async(req,res,next)=>{
    const productName=req.body.productName;
    const companyName=req.body.companyName;
    let price = req.body.price;
    const info = req.body.info;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    let pincode = req.body.pincode;
    const city = req.body.city;
    const state = req.body.state;
    const idea = req.body.idea;
    const supplyExplanation = req.body.supplyExplanation;
    const youtubeUrl = req.body.youtubeUrl;
    console.log(productName,companyName,price,info,latitude,longitude,address1,address2,pincode,city,state,idea,supplyExplanation,youtubeUrl);
    if(req.file == null){
        const error = new Error('Image must be provided');
        error.statusCode = 422;
        return next(error);
    }
    if(productName.length<4){
        const error = new Error('Project Name should be at least 4 characters');
        error.statusCode = 422;
        return next(error);
    }
    if(companyName.length<4){
        const error = new Error('Company Name should be at least 4 characters');
        error.statusCode = 422;
        return next(error);
    }
    try{
        price = parseFloat(price);
    }catch(error){
        console.log(error);
        error = new Error('Invalid price provided');
        error.statusCode = 422;
        return next(error);
    }
    try{
        latitude = parseFloat(latitude);
    }catch(error){
        error = new Error('Invalid price provided');
        error.statusCode = 422;
        return next(error);
    }
    try{
        longitude = parseFloat(longitude);
    }catch(error){
        error = new Error('Invalid price provided');
        error.statusCode = 422;
        return next(error);
    }
    if(info.length<4){
        const error = new Error('Info should be at least 4 characters');
        error.statusCode = 422;
        return next(error);
    }
    if(address1.length<1){
        const error = new Error('Address 1 be at least 1 characters');
        error.statusCode = 422;
        return next(error);
    }
    if(address2.length<1){
        const error = new Error('Address 2 should be at least 1 characters');
        error.statusCode = 422;
        return next(error);
    }
    try{
        pincode = parseInt(pincode);
    }catch(error){
        error = new Error('Invalid pincode provided');
        error.statusCode = 422;
        return next(error);
    }
    if(city.length<1){
        const error = new Error('City 2 should be at least 1 characters');
        error.statusCode = 422;
        return next(error);
    }
    if(state.length<1){
        const error = new Error('Invalid state provided');
        error.statusCode = 422;
        return next(error);
    }
    if(idea.length<10){
        const error = new Error('Idea should be at least 10 characters');
        error.statusCode = 422;
        return next(error);
    }
    if(supplyExplanation.length<10){
        const error = new Error('Supply explanation should be at least 10 characters');
        error.statusCode = 422;
        return next(error);
    }
    if(!youtubeUrl.includes('youtube.com')){
        const error = new Error('Please provide correct youtube URL');
        error.statusCode = 422;
        return next(error);
    }
    try{
        const product = new Product({
            productName:productName,
            companyName:companyName,
            price:price,
            info:info,
            latitude:latitude,
            longitude:longitude,
            address2:address2,
            address1:address1,
            pincode:pincode,
            city:city,
            state:state,
            idea:idea,
            supplyExplanation:supplyExplanation,
            creatorId:req.userId,
            youtubeUrl:youtubeUrl,
            imageUrl:req.file.path,
        });
        const doc =await product.save();
        res.status(201).json({message:'Success',productId:doc._id});
        console.log(doc);
    }catch(error){
        console.log(error);
        if(!error.statusCode){
            error.statusCode=500;
        }
        error.message='Server Error';
        return next(error);
    }
}

exports.getProducts = async (req,res,next)=>{
    try{
        const doc = await Product.find();
        res.status(200).json({products:doc});
    }catch(error){
        console.log(error);
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}

exports.downloadImage = async (req,res,next)=>{
    const filePath = path.join(__dirname,'..','product_image',`${req.query.creator}-${req.query.productName}.jpg`);
    res.download(filePath);
}