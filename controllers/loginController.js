const fs = require('fs');
const dbHandelr = require('../dbHandler');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

let secretKey = fs.readFileSync('./theBestSecuredPrivateKeyEver', 'utf8');

const get = (req, res) => {
    console.log('accessing login page');
    res.render('login');
}

const checkUser = async (db, name, password) => {
    try {
        let res = await dbHandelr.containsUserWithPassword(db, name, password);
        return res;
    } catch (err) {
        return false;
    }
}

const post = async (req, res) => {
    const db = req.db;
    console.log('post_login');
    console.log(req.body);
    const { name, password } = req.body;
    const userdto = { name: name, password: password };

    try {
        const foundUser = await dbHandelr.contains(db,
            'SELECT * FROM users where name = ? and password = ?',
            [name, password]
        );

        if (foundUser) {
            req.user = userdto;
            dbHandelr.updateEntranceCounter(db, name);

            const token = jwt.sign({ user: userdto }, secretKey, { expiresIn: '7d' });
            res.cookie('TC', token, { httpOnly: true });
            res.redirect('/ranking');
        } else {
            console.log('User not found or incorrect password');
            const msg = {
                text: 'User not found or incorrect password'
            };
            console.log(msg);
            res.render('login', { msg });
        }
    } catch (err) {
        const msg = {
            text: 'There is a problem with the given credentials'
        };

        console.error(err);
        res.render('login', { msg });
    }
};

const get_ranking = async (req, res) => {
    let userdto = req.user || { name: 'guest', password: 'secret' };
    let db = req.db;
    let msg = `Welcome, ${userdto.name}! Here is the real-time ranking of 5 users with the highest number of successful logins. See if you are on the list!`;

    try {
        let top5 = await dbHandelr.getTop5(db);
        let content = {
            msg: msg,
            table: top5
        };

        res.render('ranking', { content });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    get,
    post,
    get_ranking,
};
