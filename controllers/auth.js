const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const {validationResult} = require('express-validator');

const User = require('../models/user');
const emailHtml = require('../helpers/email');

sgMail.setApiKey('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');


exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors); 
        const error = new Error(errors.errors[0].msg);
        //error.message=errors.errors[0].msg;
        error.statusCode = 422;
        return next(error);
    }
    const email = req.body.email;
    const password = req.body.password;
    const emailToken = Math.floor(1000 + Math.random() * 9000);
    let hashPw;
    try{
        hashPw = await bcrypt.hash(password,12);
    }catch(error){
        const errors = new Error();
        errors.message = error;
        throw errors;
    }
    const user = new User({
        email:email,
        emailToken:emailToken,
        password:hashPw
    });
    const savedUser = await user.save();
    const userId = savedUser._id.toString();
    const msg = {
        to: req.body.email,
        from: 'signup@idealobs.com',
        subject: 'Verify your email',
        text: 'and easy to do anywhere, even with Node.js',
        html: emailHtml.verification(emailToken),
    };
    const token = jwt.sign({email: email,userId:userId},'thisisaveryveryverylongandimportantsecret',{expiresIn:'1h'});
    await User.findByIdAndUpdate({_id:userId},{token: token});
    await sgMail.send(msg);
    res.status(200).json({
        userId:userId,
        token:token,
        message: 'success'
    });
}

exports.verify = async (req,res,next) => {
    const emailToken = req.body.emailToken;
    let user;
    try{
        user =await User.findById({_id:req.userId});
        var date = new Date(user.updatedAt);
        var currentDate = Date.now();
        console.log(currentDate-date);
        if(currentDate-date-600000>0){
            const error = new Error('Verification code expired');
            error.statusCode=403;
            return next(error);
        }
        const token = jwt.sign({email: user.email,userId:user._id},'thisisaveryveryverylongandimportantsecret',{expiresIn:'1h'});
        if(user.emailToken.toString() === emailToken.toString()){
            await User.findByIdAndUpdate({_id:req.userId},{verified:true,token:token});
            res.status(201).json({message:'Verified',userId:req.userId,token:token});
        }
        else{
            const error = new Error('Unauthenticated');
            error.statusCode=403;
            return next(error);
        }
    }catch(err){
        console.log(err);
        const error = new Error('Could not verify');
        error.statusCode = 500;
        return next(error);
    }
}

exports.login =async (req,res,next)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email:email});
        if(!user){
            const error = new Error('Email not registered');
            error.statusCode = 401;
            return next(error);
        }
        const isEqual =await bcrypt.compare(password,user.password);
        console.log(isEqual);
        if(!isEqual || !user.verified){
            const error = new Error('Wrong password or email not verified');
            error.statusCode = 401;
            return next(error);
        }
        const token = jwt.sign({email: email,userId:user._id},'thisisaveryveryverylongandimportantsecret',  {expiresIn:'1h'});
        await User.findByIdAndUpdate({_id:user._id},{token:token});
        res.status(200).json({message:'success',userId:user._id,token:token,enrolledProjects:user.enrolledProjects,username:user.username});
    }catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}

exports.complete_profile= async (req,res,next) => {
    if(!req.file){
        const error = new Error('No image provided!');
        error.statusCode = 422;
        return next(error);
    }
    const username = req.body.username;
    const description = req.body.description;
    const gender = req.body.gender;
    try{
    if(gender !=='Male' && gender !== 'Female' && gender !== 'Others'){
        const error = new Error('Invalid gender type provided!');
        error.statusCode = 422;
        return next(error);
    }
    const doc = await User.findOne({username:username});
    if(doc){
        const error = new Error('Username already taken!');
        error.statusCode = 422;
        return next(error);
    }
        const user = User.findOne({_id:req.userId});
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 401;
            return next(error);
        }
        const response = await User.updateOne({_id:req.userId},{gender:gender,description:description,username:username,imageUrl:req.file.path});
        res.status(200).json({message:'success',userId:req.userId,username:username});
    }catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}

exports.profilePicture = async (req,res,next) => {
    try{
        let userId;
        let username = req.query.username;
        if(username == null){
            userId = req.query.userId;
            if(userId == null){
                const error = new Error('Username and userId both are not provided!');
                error.statusCode = 422;
                return next(error);
            }
            const doc = await User.findOne({_id:userId});
            username = doc.username;
    }
    const filePath = path.join(__dirname,'..','profile_images',`${username}.png`);
    res.download(filePath);
    }catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}