const express = require('express');
const mongoose = require('mongoose');
const path =require('path');
const {validationResult} = require('express-validator');
const Request = require('../models/requests');
const User = require('../models/user');

exports.newRequest = async (req,res,next)=> {
    if(!req.file){
        const error = new Error('CV not provided!');
        error.statusCode = 422;
        return next(error);
    }
    try{
        const from = req.userId;
        const to = req.body.projectCreatorId;
        const projectId = req.body.projectId;
        const name = req.body.name;
        const officialEmail = req.body.officialEmail;
        const info = req.body.info;
        const reasonForProject = req.body.reasonForProject;
        const doc = await User.findOne({_id:req.userId});
        const username = doc.username;
        if(from.length<0 || to.length<0 || projectId.length<0){
            const error = new Error('Server Error');
        error.statusCode = 500;
        return next(error);
        }
        if(name == null || name.length<0){
            const error = new Error('Name cannot be empty!');
        error.statusCode = 422;
        return next(error);
        }
        if(!officialEmail.includes('@')){
            const error = new Error('Please provide correct email!');
        error.statusCode = 422;
        return next(error);
        }
        if(info == null || info.length<10){
            const error = new Error('You should tell about yourself in more than 10 words!');
        error.statusCode = 422;
        return next(error);
        }
        if(reasonForProject == null || reasonForProject.length<20){
            const error = new Error('You should explain reason to join a team in more than 20 words!');
        error.statusCode = 422;
        return next(error);
        }
        const request = new Request({
            from:mongoose.Types.ObjectId(from),
            to:mongoose.Types.ObjectId(to),
            projectId:mongoose.Types.ObjectId(projectId),
            username:username,
            name:name,
            officialEmail:officialEmail,
            info:info,
            reasonForProject:reasonForProject,
            cvUrl:req.file.path
        });
        const response = await request.save();
        const requestId = response._id.toString();
        res.status(201).json({
            requestId:requestId,
            message: 'success'
        });
    }catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}

exports.requests = async (req,res,next) =>{
    try{
        const response = await Request.find({to:mongoose.Types.ObjectId(req.userId)});
        res.status(200).json({requests:response});
    }catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}