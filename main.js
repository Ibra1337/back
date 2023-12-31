const express = require('express');
const router = require('./router');
const http = require('http');
const socketIO = require('socket.io');
const dbHandler = require('./dbHandler')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let secretKey = fs.readFileSync('./theBestSecuredPrivateKeyEver', 'utf8');

app.use(cookieParser());

app.use(cors());

app.use(express.json());

app.set('view engine', 'ejs');

server.listen(8080)

const db = dbHandler.initialize();

app.use(async (req, res, next) => {
    req.db = db;
    next();
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


let timestampToUpdate = new Date('2023-01-01T12:00:00Z').getTime(); 

setInterval(async () => {
    const currentTime = Date.now();
    if (currentTime >= timestampToUpdate) {
        const top5 = await dbHandler.getTop5(db);


        io.emit('updateEvent', top5);
    }
}, 1000);


console.log( __dirname + '/public');

app.use(express.static( __dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.path = req.path;
next();
});
app.get("/" , async(req, res) =>
{
    if (req.cookies.TC) {
        const verified = jwt.verify(req.cookies.TC , secretKey);
        const userdto = verified.user;
        const foundUser = await dbHandler.contains(db,
            'SELECT * FROM users where name = ? and password = ?',
            [userdto.name, userdto.password])

            if (foundUser)
            {
                req.user = userdto;
                dbHandler.updateEntranceCounter(db, userdto.name);
    
                const token = jwt.sign({ user: userdto }, secretKey, { expiresIn: '7d' });
                res.cookie('TC', token, { httpOnly: true });
                res.redirect('/ranking');
            }
        
    } else {
        console.log('session does not exists')
        res.redirect("/register");
    }
    
}) 

app.use(router.router)

