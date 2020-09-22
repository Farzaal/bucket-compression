const express = require('express');
const router = express.Router();
const CompressionController = require('../controllers/CompressionController');

router.post('/compress/image', CompressionController.compressImage); 

module.exports = router;