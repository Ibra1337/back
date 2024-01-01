const express = require('express');
const router = require('./router');
const http = require('http');
const socketIO = require('socket.io');
const dbHandler = require('./dbHandler')



const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.listen(8080);

app.set('view engine', 'ejs');
const db = dbHandler.initialize();
app.use(async (req, res, next) => {
    // Attach the db variable to the request object
    req.db = db;
    next();
});

const timestampToUpdate = new Date('2023-01-01T12:00:00Z').getTime(); // Replace with your desired timestamp
setInterval(() => {
    const currentTime = Date.now();
    if (currentTime >= timestampToUpdate) {
        io.emit('updateEvent', { message: 'Update has occurred!' });
    }
}, 1000); // Check every second for the update event

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

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

