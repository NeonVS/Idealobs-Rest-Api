const express = require('express');
const {
    body
} = require('express-validator');

const isAuth = require('../middleware/isAuth');
const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, {
        req
    }) => {
        return User.findOne({
            email: value
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-Mail address already exists!');
            }
        })
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({
        min: 8
    }),
], authController.signup);

router.post('/verify', [
    body('emailToken')
    .isLength({
        min: 4,
        max: 4
    })
],isAuth, authController.verify);

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({
        min: 8
    }),
], authController.login);

router.post('/complete_profile',isAuth, authController.complete_profile);

router.get('/profile_pic',authController.profilePicture);

module.exports = router;