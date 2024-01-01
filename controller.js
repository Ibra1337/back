// controller.js
const e = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const dbHandelr = require('./dbHandler');
const userFile = 'users.json';


const get_register = (req, res) => {
    res.render('register');
}

const post_register = async (req, res) => {
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

        // Use async/await for containsUsername
        let usernameExists = await dbHandelr.containsUsername(db, name);

        if (usernameExists) {
            val = false;
            msg.name = 'Given name is already taken, try something else';
            console.log('Such user already exists');
        }

        // Use async/await for contains
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

const get_login = (req, res) => {
    
    console.log('accesing loginpage');
    res.render('login');

}

const checkUser = async(db , name , password) =>
{
    try{
        let res = await dbHandelr.containsUserWithPassword(db , name , password);
        return res;
    }catch(err){
        return false;
    }
}

const post_login = async (req, res) => {
    const db = req.db;
    console.log('post_login');
    console.log(req.body);
    const { name, password } = req.body;
    const userdto ={ name: name , password : password};
    
    try {
        const foundUser = await dbHandelr.contains(db , 
            'SELECT * FROM users where name = ? and password = ?'
            ,[name , password]);

        if (foundUser) {
            req.user = userdto; // Assuming you have 'userdto' defined somewhere
            dbHandelr.updateEntranceCounter(db , name);
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

        res.render('ranking', {content});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const api_getData = async (req, res) => {
    try {
        // Fetch updated data using the getTop5 function
        const updatedData = await getTop5(/* pass your database connection here */);

        // Send the updated data as JSON
        res.json(updatedData);
    } catch (error) {
        console.error('Error fetching updated data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    get_register,
    post_register ,
    get_login ,
    post_login , 
    get_ranking ,
    api_getData
};
