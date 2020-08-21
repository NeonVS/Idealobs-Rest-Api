const express = require('express');

const projectController = require('../controllers/projects');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/add_project',isAuth,projectController.addProject);

module.exports = router;