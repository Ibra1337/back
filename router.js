
const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/register', controller.get_register);
router.post('/register', controller.post_register);
router.get('/login' , controller.get_login);
router.post('/login' , controller.post_login);
router.get('/ranking' , controller.get_ranking );
router.get('/api/getData' , controller.api_getData)

module.exports = 
    {
        router
    };
