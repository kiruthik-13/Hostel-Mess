const express = require('express');
const {
  getCurrentMenu,
  getMenuByDate,
  upsertMenu,
} = require('../controllers/menuController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/current', getCurrentMenu);
router.get('/', authenticate, getMenuByDate);
router.put('/', authenticate, authorize('admin'), upsertMenu);

module.exports = router;
