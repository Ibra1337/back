// controller.js
const e = require('express');
const fs = require('fs');
const userFile = 'users.json';

const fromFileToArr = () => {
    let userArr;
    let savedUsers = fs.readFileSync(userFile );
        
    try {
        userArr = JSON.parse(savedUsers , 'utf8');
        console.log(typeof(userArr));
    }catch (err)
    {
        console.error('problem with prasing');
    }
    if (!Array.isArray(userArr)) {
        
        userArr = [userArr];
        console.log(userArr)
    }
    return userArr;
}

const register = (req, res) => {
    res.render('register'); // Assuming your HTML file is named 'login.html'
}

const post_register = (req, res) => {
    

    const {name} = req.body;
    const {email} = req.body;
    const {password} = req.body;
    const {confirm_password} = req.body;
    
    let val = true;
    let info = {
        name : "",
        email : "",
        password :""
    };
    console.log(req.body)

    if (password !== confirm_password)
    {
        info.password ='the given passwords should be the same';
        val = false;

    } 

    let userArr = fromFileToArr();

        console.log("'userArr: " +userArr)
        let user = {
            username : name,
            email : email ,
            password : password
        };
    
        if (userArr.some( (user) => user.username === name ) )
        {
            val = false;
            info.name = 'given name is already taken try something else';
            console.log('such user alredy exists ' + name +':'+ user)
        }


        if (userArr.some( (user) => user.email === email ) )
        {
            val = false;
            info.name = 'given email is already taken try something else';
            console.log('such email alredy exists')
        }


    
    if (val)
    {
        userArr.push(user);
        console.log(user);
        const userJson = JSON.stringify(userArr, (key, value) => (key === '' ? value : value), 1);


        console.log(userJson);

        fs.writeFile(userFile, userJson, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data has been written to the JSON file successfully.');
              // Continue with any additional code you want to execute after writing to the file
            }
        });
        res.redirect('/login'); // Corrected redirect statement
            
    
    } else {
        res.render('register' ,info );
    }
}

const get_login = (req, res) => {
    console.log('accesing loginpage');
    res.render('login');

}

const post_login = (req , res ) => {
    console.log('post_login');
    console.log(req.body)
    const {name} = req.body;
    const {password} = req.body;

    console.log(name);
    const userArr = fromFileToArr();

    console.log(userArr.length);

    console.log(userArr);
    console.log('----------------------');
    const foundUser = userArr.find(user => user.username === name );

    console.log(foundUser);
    if (foundUser && foundUser.password === password) {
        console.log(foundUser);
        res.render("final"); 
    } else {
    console.log('User not found or incorrect password');
    res.redirect('/login');
    
}


}

module.exports = {
    register,
    post_register ,
    get_login ,
    post_login
};
