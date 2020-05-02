const express  = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//passport config
require('./config/passport')(passport);

//database config
const db = require(./config/keys).mogoURI;

//Connectiong to Mongodb
mongoose
  .connect(db, {useNEWUrlParser: true})
  .then(()=> console.log('MongoDB COnnected'))
  .catch(err => conosle.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body parser for express
app.use(express.urlencoded({ extended: true}));

//Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUnimitilized: true
  })
);

//Middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//Flash Messages
app.use(function(req, res, next){
  res.locals.succes_msg = req.flash('succes_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.loclas.error = req.flash('error');
});

//Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log('Server started on port ${PORT} ..Connected'));
