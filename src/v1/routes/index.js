const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const playersRoutes = require('./players');

router.use('/', healthRoutes);
router.use('/players', playersRoutes);

module.exports = router;
