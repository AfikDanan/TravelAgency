const path = require('path');
const express = require('express');
const flightController = require('../controllers/flight');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/', flightController.getIndex);

router.get('/flights', flightController.getAllflights);

router.get('/filterFlights', flightController.getFilterflights);

router.get('/flights/:flightId', flightController.getflight);

router.get('/cart', isAuth, flightController.getCart);

router.post('/cart', isAuth, flightController.postCart);

router.post('/cart-delete-item', isAuth, flightController.postCartDeleteflight);

router.post('/create-order', isAuth, flightController.postOrder);

router.get('/orders', isAuth, flightController.getOrders);

router.get('/orders/:orderId', isAuth, flightController.getInvoice);

router.get('/checkout', isAuth, flightController.getCheckout);

router.get('/checkout/success', flightController.getCheckoutSuccess);

router.get('/checkout/cancel', flightController.getCheckoutCancel);

module.exports = router;
