const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const socketjs = require('./socket');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const requestRoutes = require('./routes/requests');
const messageRoutes = require('./routes/messages');

const app = express();

const fileStorageProfile = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'profile_images'),
    filename:(req,file,cb)=>cb(null,file.originalname),
});
const fileStorageProject = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'project_images'),
    filename:(req,file,cb)=>cb(null,file.originalname),
});
const fileStorageProjectRequest = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'user_cv'),
    filename:(req,file,cb)=>cb(null,file.originalname),
});

app.use(bodyParser.json());
// app.use(multer({storage:fileStorageProfile}).single('image'));
// app.use(multer({storage:fileStorageProject}).single('project_image'));
// app.use(multer({storage:fileStorageProjectAttachment}).single('project_file'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use('/auth',multer({storage:fileStorageProfile}).single('image'), authRoutes);
app.use('/project',multer({storage:fileStorageProject}).fields([{name:'project_image',maxCount:1},{name:'project_file',maxCount:1}]),projectRoutes);
app.use('/request',multer({storage:fileStorageProjectRequest}).single('cv'),requestRoutes);
app.use('/message',messageRoutes);

app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message});
});

mongoose.connect('mongodb+srv://Vishu:vishu12345678@cluster0.t8zcy.mongodb.net/idealobsDB?retryWrites=true&w=majority',{useUnifiedTopology:true,useNewUrlParser:true}).then(result =>{
    console.log('CONNECTED TO SERVER');
    const server = app.listen(3000);
    const io = socketjs.init(server);
    io.on('connection',socket =>{
        socketjs.socketConnection(socket);
    });
}).catch(err =>{
    console.log(err);
})