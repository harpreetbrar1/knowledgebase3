const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const loginRouter = require('./route/authRouter');
const appRouter = require('./route/appRouter')
const con = require("./util/database.js")
const cookieParser = require('cookie-parser');
const session = require('express-session');
const io = require("socket.io")(5000);

io.on("connection", (socket) => {
    socket.on("leave", (conversation) => {
        socket.leave(conversation);
    });

    socket.on("join", (conversation) => {
        socket.join(conversation);
    });

    socket.on("private-message", (data) => {
        socket.broadcast.to(data.room).emit("private-message-retrieval", {
            text: data.message,
            firstname: data.user[0].firstname,
            lastname: data.user[0].lastname,
            imageurl: data.user[0].imageurl
        });
    });
});

// Using hbs template engine
app.engine('hbs',expressHbs ({
      defaultLayout: 'main-layout',
      layoutsDir: 'views/layouts/',
      partialsDir: ['views/partials/app', 'views/partials/auth'],
      extname: 'hbs'
    })
  );
app.set('view engine', 'hbs');
app.set('views', 'views');

// connecting route to database
app.use(function(req, res, next) {
  req.con = con
  next()
})

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false, 
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false })) // middleware
app.use(bodyParser.json()) // middleware
app.use(loginRouter);
app.use(appRouter)
app.use(express.static(__dirname + '/public'));

app.listen( 3000, () => console.log('Server ready'))
