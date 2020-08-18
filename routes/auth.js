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
    .trim()
    .isLength({
        min: 5,
        max: 5
    })
],isAuth, authController.verify);


module.exports = router;