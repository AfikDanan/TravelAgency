const path = require('path');
const express = require('express');
const flightController = require('../controllers/flight');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/', flightController.getIndex);

router.get('/flights', flightController.getAllflights);

router.get('/filterFlights', flightController.getFilterflights);

router.get('/flights/:flightId', flightController.getflight);

router.get('/cart', isAuth, flightController.checkStock, flightController.getCheckout);

router.post('/cart', isAuth, flightController.postCart);

router.post('/cart-delete-item', isAuth, flightController.postCartDeleteflight);

router.post('/create-order', isAuth, flightController.postOrder);

router.get('/orders', isAuth, flightController.getOrders);

router.get('/checkout/success', isAuth, flightController.getCheckoutSuccess);

router.get('/checkout/cancel', isAuth, flightController.getCheckoutCancel);

router.get('/orders/:orderId', isAuth, flightController.getInvoice);

module.exports = router;
