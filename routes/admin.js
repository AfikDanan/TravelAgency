const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-flight => GET
router.get('/add-flight', isAuth, adminController.getAddflight);

// /admin/flights => GET
router.get('/flights', isAuth, adminController.getflights);

// /admin/add-flight => POST
router.post('/add-flight', isAuth, adminController.postAddflight);

router.get('/edit-flight/:flightId', isAuth, adminController.getEditflight);

router.post('/edit-flight', isAuth, adminController.postEditflight);

router.post('/delete-flight', isAuth, adminController.postDeleteflight);

module.exports = router;
