
const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/register', controller.register);
router.post('/register', controller.post_register);

module.exports = 
    {
        router
    };
