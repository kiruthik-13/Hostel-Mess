const express = require('express');
const { getSummary, getRawFeedback } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticate, authorize('admin'), getSummary);
router.get('/feedback', authenticate, authorize('admin'), getRawFeedback);

module.exports = router;
