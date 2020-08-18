const express = require('express');
const {body} = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup',[
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value,{req})=>{
        return User.findOne({email:value}).then(userDoc =>{
            if(userDoc){
                return Promise.reject('E-Mail address already exists!');
            }
        })
    })
    .normalizeEmail(),
    ],authController.signup);

module.exports = router;