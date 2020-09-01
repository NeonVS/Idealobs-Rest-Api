const express = require('express');

const isAuth = require('../middleware/isAuth');

const orderController = require('../controllers/orders');

const router = express.Router();

router.post('/add_item',isAuth,orderController.addOrder);

router.get('/get_orders',isAuth,orderController.getOrders);

module.exports = router;