const path = require('path');
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.get('/login', loginController.getLoginPage);


module.exports = router;