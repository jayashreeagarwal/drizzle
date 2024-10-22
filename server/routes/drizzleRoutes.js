const express = require('express');
const router = express.Router();
const drizzleController = require('../controllers/drizzleController');

router.get('/', drizzleController.homepage);
router.get('/dashboard', drizzleController.dashboard);
router.get('/case/:id', drizzleController.exploreCaseById);
module.exports = router;