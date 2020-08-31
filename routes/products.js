const express = require('express');
const mongoose = require('mongoose');

const {body} = require('express-validator');

const Product = require('../models/products');

const productController = require('../controllers/products');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/add_product',isAuth,productController.addProduct);

router.get('/get_products',isAuth,productController.getProducts);


router.get('/product_image',productController.downloadImage);

module.exports = router;