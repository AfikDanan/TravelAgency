const path = require('path');
const express = require('express');
const flightController = require('../controllers/flight');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/', flightController.getIndex);

router.get('/flights', flightController.getflights);

router.get('/flights/:flightId', flightController.getflight);

router.get('/cart', isAuth, flightController.getCart);

router.post('/cart', isAuth, flightController.postCart);

router.post('/cart-delete-item', isAuth, flightController.postCartDeleteflight);

router.post('/create-order', isAuth, flightController.postOrder);

router.get('/orders', isAuth, flightController.getOrders);
module.exports = router;
