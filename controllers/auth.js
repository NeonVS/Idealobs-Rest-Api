const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const {validationResult} = require('express-validator');

const User = require('../models/user');
const emailHtml = require('../helpers/email');

sgMail.setApiKey('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');


exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const emailToken = Math.floor(Math.random()*90000) + 10000;
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
    const token = jwt.sign({email: email,userId:userId},'thisisaveryveryverylongandimportantsecret');
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
        if(user.emailToken.toString() === emailToken.toString()){
            await User.findByIdAndUpdate({_id:req.userId},{verify:true});
            res.status(201).json({message:'Verified',userId:req.userId});
        }else{
            const error = new Error('Unauthenticated');
            error.statusCode=403;
            next(error);
        }
    }catch(err){
        const error = new Error('Could not verify');
        error.statusCode = 500;
        next(error);
    }
}