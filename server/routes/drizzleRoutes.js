const express = require('express');
const router = express.Router();
const ratemyController = require('../controllers/drizzleController');

router.get('/', ratemyController.homepage);
router.get('/dashboard', ratemyController.dashboard);

module.exports = router;