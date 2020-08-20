const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'profile_images'),
    filename:(req,file,cb)=>cb(null,Math.floor(1000 + Math.random() * 9000)+'-'+file.originalname),
});

app.use(bodyParser.json());
app.use(multer({storage:fileStorage}).single('image'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use('/auth', authRoutes);

app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message});
});

mongoose.connect('mongodb+srv://Vishu:vishu12345678@cluster0.t8zcy.mongodb.net/idealobsDB?retryWrites=true&w=majority',{useUnifiedTopology:true,useNewUrlParser:true}).then(result =>{
    console.log('CONNECTED TO SERVER');
    app.listen(3000);
}).catch(err =>{
    console.log(err);
})