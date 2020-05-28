var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

require('dotenv').config({
  path: '../.env'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

// jwt
var jwt = require('jsonwebtoken');
var private = 'pRiVaTeKeY'; // Can be set in .env and retrieved with process.env.KEY or whatever the string name is set to

function verify(req,res,next) {
  jwt.verify(req.cookies.token, private, (err, decoded) => {
    if (!err){next();}
    else {
      res.status(400).send('verification failed')
    };
  });
};


// mongoose - change once docker envionment is being setup
// "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe" - admin privalidge
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});


// creating Schemas
var userLoginSchema = new mongoose.Schema({
  username: String,
  password: String
});

// connecting to localhost mongodb
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
});

app.post('/user/create', (req,res) => {
  var user = mongoose.model('User', userLoginSchema);
  user.findOne({username: req.body.username}, (err, data) => {
    if (err){console.log("error", err)} // if theres a error, show in console
    if (!data){
      user.create({username: req.body.username, password: req.body.password}) // creates user
      res.status(200).send('User created');
    } else {
      res.status(400).send('Username already exists');  // sends status saying the username is already taken
    };
  });
});

app.post('/user/login', (req, res) => {
  var user = mongoose.model('User', userLoginSchema);
  user.findOne({username: req.body.username}, (err, data) => {
    if (err){console.log("error", err)} // if theres a error, show in console
    if (data.password==req.body.password){

      // set JWT and send
      var token = jwt.sign({
        data: {
          id: data._id, 
          username: data.username
        }
      }, private);

      res.cookie('token', token, {
        httpOnly: true
      })

      res.status(200).send('Correct password');
    } else {
      res.status(400).send('Incorrect password');
    }
  });
});

app.use('/user/verify', (req, res) => {
  // get token and see if the information is valid so that the user can continue
  jwt.verify(req.cookies.token, private, (err, decoded) => {
    if (err){res.status(400).send('invalid');console.log(err); return;};
    if (decoded) {
      res.status(200).send('verified');
    }
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.listen(3001);