const express = require('express');
const mongoose = require('mongoose');

const {body} = require('express-validator');

const Project = require('../models/projects');

const projectController = require('../controllers/projects');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/add_project',isAuth,projectController.addProject);

router.post('/check_projectName',isAuth,[body('projectName').custom((value,{req})=>{
    return Project.findOne({projectName:req.body.projectName,creator:mongoose.Types.ObjectId(`${req.userId}`)}).then(userDoc=>{
        if(userDoc){
            return Promise.reject('Project with same Project name already exists by you!');
        }
    })
})],projectController.checkProjectName);

router.get('/get_projects',isAuth,projectController.getProjects);

router.get('/project_attachment',projectController.downloadAttachment);

router.get('/project_image',projectController.downloadImage);

module.exports = router;