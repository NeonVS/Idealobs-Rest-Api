const express = require('express');
const mongoose = require('mongoose');
const {
    body
} = require('express-validator');

const isAuth = require('../middleware/isAuth');
const requestControllers = require('../controllers/requests');

const router = express.Router();

router.get('/requests',isAuth,requestControllers.requests);
router.post('/new_request', isAuth,requestControllers.newRequest
);
router.post('/confirm_request',isAuth,requestControllers
.confirmRequest);

router.post('/deny_request',isAuth,requestControllers
.denyRequest);

module.exports =router;