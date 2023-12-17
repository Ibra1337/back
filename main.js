const express = require('express');
const router = require('./router');


const app = express();

app.listen(8080);

app.set('view engine', 'ejs');

console.log( __dirname + '/public');

app.use(express.static( __dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.path = req.path;
next();
});
app.get("/" , (req, res) =>
{
    res.redirect("/register");
}) 

app.use(router.router)