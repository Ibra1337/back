const express = require('express');
const loginController = require('./controllers/loginController');
const registerController = require('./controllers/registerController')

const router = express.Router();

router.get('/register', registerController.get);
router.post('/register', registerController.post);

router.get('/login', loginController.get);
router.post('/login', loginController.post);

router.get('/ranking', loginController.get_ranking);

module.exports = {
    router
};
