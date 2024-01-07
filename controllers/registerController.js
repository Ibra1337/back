const dbHandelr = require('../dbHandler');
const e = require('express');

const get = async(req, res) => {
    res.render('register');
}

const post = async (req, res) => {
    try {
        let db = req.db;
        const { name, email, password, confirm_password } = req.body;

        let val = true;

        let msg = {
            name: "",
            email: "",
            password: ""
        };

        console.log(req.body);

        if (password !== confirm_password) {
            msg.password = 'The given passwords should be the same';
            val = false;
        }

        console.log(name);

        let usernameExists = await dbHandelr.containsUsername(db, name);

        if (usernameExists) {
            val = false;
            msg.name = 'Given name is already taken, try something else';
            console.log('Such user already exists');
        }

        let emailExists = await dbHandelr.contains(db, 'SELECT * FROM users WHERE email = ?', [email]);

        if (emailExists) {
            val = false;
            msg.email = 'Given email is already taken, try something else';
            console.log('Such email already exists');
        }

        if (val) {
            console.log(`User: ${name}`);
            await dbHandelr.insertUser(db, name, email, password);
            res.redirect('/login');
        } else {
            res.render('register', { msg });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    get ,
    post
}