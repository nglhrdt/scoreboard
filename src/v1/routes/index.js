const express = require('express');
const router = express.Router();

const gameRoutes = require('./games');
const healthRoutes = require('./health');
const playersRoutes = require('./players');

router.use('/', healthRoutes);
router.use('/games', gameRoutes);
router.use('/players', playersRoutes);

module.exports = router;
