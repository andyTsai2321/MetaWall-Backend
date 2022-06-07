var express = require('express');
var router = express.Router();
const uploadController = require('../controllers/upload');
const handleErrorAsync = require('../service/handleErrorAsync');
const sizeOf = require('image-size');
const upload = require('../service/image');
const { isAuth } = require('../service/auth');
const { imgurClient } = require('imgur');

router.post('/', isAuth, upload, handleErrorAsync(uploadController.uploadImage));

module.exports = router;
