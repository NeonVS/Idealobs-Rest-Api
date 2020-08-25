const express = require('express');
const mongoose = require('mongoose');
const isAuth = require('../middleware/isAuth');

const messageController = require('../controllers/messages');

const router = express.Router();

router.get('/messages',isAuth,messageController.getMessages);

module.exports = router;