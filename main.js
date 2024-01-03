const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const dbHandler = require('./dbHandler');
const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('view engine', 'ejs');

app.use(cors());


const db = dbHandler.initialize();
app.use(async (req, res, next) => {
    req.db = db;
    next();
});


app.use(express.static(__dirname + '/public'));

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});


app.get("/", (req, res) => {
    res.redirect("/register");
});


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


app.use(router.router);

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

let timestampToUpdate = new Date('2023-01-01T12:00:00Z').getTime(); 

setInterval(async () => {
    const currentTime = Date.now();
    if (currentTime >= timestampToUpdate) {
        // Asynchronously fetch the top 5 data from the database
        const top5 = await dbHandler.getTop5(db);


        io.emit('updateEvent', top5);
    }
}, 1000);
