const express = require('express');
const { submitFeedback, getMyFeedback } = require('../controllers/feedbackController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize('student'), submitFeedback);
router.get('/me', authenticate, getMyFeedback);

module.exports = router;
