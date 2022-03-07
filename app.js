// TODO 
// 1.


if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrat = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const http = require('http');
const reload = require('reload');



// Models
const User = require('./models/user');



// Routes
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');



// Mongoose connection
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/spacestation'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



// Session
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET || 'secretsauce'
    }
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR:", e);
})
app.set('trust proxy', true)
const sessionConfig = {
    store,
    name: 'spacestation',
    secret: process.env.SECRET || 'secretsauce',
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: process.env.SECURE || false,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))



// App
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize({
    replaceWith: '_'
}));





// Auth
app.use(passport.initialize());
app.use(passport.session())

passport.use(new LocalStrat(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



// Flash
app.use(flash());



// Helmet
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://fonts.googleapis.com"
];
const connectSrcUrls = [
    "https://res.cloudinary.com/dgvmvasdt/",
    "ws://localhost:9856/"
];
const fontSrcUrls = [
    "https://fonts.gstatic.com"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dgvmvasdt/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



// Locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/', userRoutes)
app.use('/posts', postRoutes)
app.use('/posts/:id/comments', commentRoutes)


app.all('*', (req, res, next) => {
    if (req.url === "/reload/reload.js") {
        next()
    } else {
        next(new ExpressError('DEV: Page Not Found', 404))
    }
})

app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500
    if (!err.message) err.message = "Something went wrong"
    res.status(err.statusCode).render('error', { err })
})

const port = process.env.PORT || 3000
app.set('port', process.env.PORT || 3000)
const server = http.createServer(app)

// Reload code here
reload(app).then(function (reloadReturned) {
    server.listen(app.get('port'), function () {
        console.log('Web server listening on port http://localhost:' + app.get('port'))
    })
}).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
})
