// controller.js
const e = require('express');
const fs = require('fs');
const userFile = 'users.json';

const register = (req, res) => {
    res.render('register'); // Assuming your HTML file is named 'login.html'
}

const post_register = (req, res) => {
    

    const {name} = req.body;
    const {email} = req.body;
    const {password} = req.body;
    const {confirm_password} = req.body;

    console.log(req.body)

    if (password !== confirm_password)
    {
        text = {msg : 'the given passwords should be the same'};
        res.render('register' ,  text)
        console.log(confirm_password )
        console.log(confirm_password);
        
    }
    const user = {
        username : name,
        email : email ,
        password : password
    };
    console.log(user);
    const userJson = JSON.stringify(user);
    console.log(userJson);
    fs.writeFileSync(userFile , userJson);
    console.log(name); // Assuming you want to log the form data
    
    res.render('register')
}

module.exports = {
    register,
    post_register
};
