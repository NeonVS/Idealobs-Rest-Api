const express = require('express');
const mongoose = require('mongoose');

const Project = require('../models/projects');

exports.addProject = async (req,res,next)=>{
    if(!req.files){
        const error = new Error('Image or file  provided!');
        error.statusCode = 422;
        return next(error);
    }
    try{
        const projectName = req.body.projectName;
        const companyName = req.body.companyName;
        const numColabs = req.body.numColabs;
        const budget = req.body.budget;
        const amountPayable = req.body.amountPayable;
        const intro = req.body.intro;
        const description = req.body.description;
        const dateTime = req.body.dateTime;
        const youtubeUrl = req.body.youtubeUrl;
        const imageUrl = req.files['project_image'][0].path;
        const documentUrl = req.files['project_file'][0].path;
        if(projectName.length<4 || companyName.length<4){
            const error = new Error('Project Name and Company Name should be at least 4 characters');
            error.statusCode = 422;
            return next(error);
        }
        if(parseInt(numColabs)<1){
            const error = new Error('Number of collaborators should  be at least 1');
            error.statusCode = 422;
            return next(error);
        }
        if(parseFloat(budget)<0 || parseFloat(amountPayable)<0){
            const error = new Error('Total budget and amount payable to each collaborator should be greater than zero');
            error.statusCode = 422;
            return next(error);
        }
        if(intro.length<10 || description.length<20){
            const error = new Error('Length of intro should be atleast 10 and length of description should be atleast 20');
            error.statusCode = 422;
            return next(error);
        }
        if(imageUrl == null || documentUrl == null){
            const error = new Error('Something went wrong in saving your files ,may be incorrect format provided!');
            error.statusCode = 422;
            return next(error);
        }
        const project = new Project({
            projectName:projectName,
            companyName:companyName,
            numColabs:numColabs,
            budget:budget,
            amountPayable:amountPayable,
            intro:intro,
            description:description,
            dateTime:dateTime,
            youtubeUrl:youtubeUrl,
            imageUrl:imageUrl,
            documentUrl:documentUrl,
            creator:req.userId
        });
        const response = await project.save();
        res.status(201).json({message:'Success',userId:req.userId,projectId:response._id.toString()});
    }catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}