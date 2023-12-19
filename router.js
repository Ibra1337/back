
const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/register', controller.register);
router.post('/register', controller.post_register);
router.get('/login' , controller.get_login);
router.post('/login' , controller.post_login);

module.exports = 
    {
        router
    };
