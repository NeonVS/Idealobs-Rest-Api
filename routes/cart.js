const express = require('express');
const {body} = require('express-validator');

const isAuth = require('../middleware/isAuth');

const cartController = require('../controllers/cart');
const router = express.Router();

router.post('/add_item',isAuth,cartController.addItem);

router.get('/get_items',isAuth,cartController.getCartItems);

router.post('/delete_item',isAuth,cartController.deleteItem);

module.exports = router;
// [body('price').isNumeric(),body('quantity').isNumeric(),body('productId').isMongoId],

