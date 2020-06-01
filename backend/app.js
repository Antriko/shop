var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const fs = require('fs');
var multer  = require('multer');  // middleware for file uploading (multipart/form-data)

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

app.use('/test', (req, res) => {
  res.send(`
  <form action="/shop/create" method="post" enctype="multipart/form-data">
            <input type="file" name="avatar" multiple/>
            <input type="submit" value="Submit" />
        </form>
  `)
});
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


// mongoose - change once docker envionment is being setup (maybe?)
// "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe" - start with admin privalidges
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});


// creating Schemas
var userLoginSchema = new mongoose.Schema({
  username: String,
  password: String
});

var shopItemSchema = new mongoose.Schema({
  name: String,
  description: String,  
  category: String,     // add searchability
  price: Number,        // price in pence e.g. 150 = £1.50
  imageURL: Array,      // can hold more than one image of the product
  tags: Array,          // add more searchability
  hidden: Boolean,      // to hide from store
  seller: String        // to see who is selling item
});

// connecting to localhost mongodbfgdhayeh
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
});

// create user
app.post('/user/create', (req,res) => {
  var user = mongoose.model('User', userLoginSchema); // get database information

  user.findOne({username: req.body.username}, (err, data) => {    // find if there us already a username present, password verification can be done within react
    if (err){console.log("error", err)} // if theres a error, show in console
    if (!data){ // if no duplicate is found, create username
      // TODO - Encryption of password?
      user.create({username: req.body.username, password: req.body.password}); // creates user
      res.status(200).send('User created'); // tells frontend that it has processed
    } else {
      res.status(400).send('Username already exists');  // tells frontend that the username is already taken
    };
  });
});

// login
app.post('/user/login', (req, res) => {
  console.log(req.body)
  var user = mongoose.model('User', userLoginSchema); // get databse

  user.findOne({username: req.body.username}, (err, data) => {  // check if there is a username which the user has entered
    if (err){console.log("error", err)} // if theres a error, show in console
    if (data.password==req.body.password){  // gets the password from the database linked to the username entered and checks if the password the user has entered is the one that is stored in the databse
      // set JWT and send
      var token = jwt.sign({
        data: {
          id: data._id, 
          username: data.username
        }
      }, private);

      res.cookie('token', token, {  // save to frontend as cookie
        httpOnly: true
      })

      res.status(200).send('Correct password'); // tells frontend that login was successful
    } else {
      res.status(400).send('Incorrect password'); // tells frontend password is incorrect
    }
  });
});

app.use('/user/verify', (req, res) => {
  // get token and see if the token is valid so that the user can continue with their action
  jwt.verify(req.cookies.token, private, (err, decoded) => {
    if (err){res.status(400).send('invalid');console.log(err); return;};  // if token is invalid, tell frontend that
    if (decoded) {  // get the data from the JWT so that 
      res.status(200).send(decoded);  // tells frontend that the JWT is valid
    }
  })
});

var upload = multer({ dest: 'images/'})

// multipart/form-data so needs multer
app.post('/shop/create', upload.single('image1'), (req, res) => {
  console.log('dasdasdas')
  console.log(req.file);
  console.log(req.body);
  res.sendStatus(200);

  /*
  // get id so that we can save the images locally
  id = new mongoose.Types.ObjectId();
  fs.mkdir('/images/'+id, (err) => {
    if (err) {console.log(err);}
  });


  // add item to shop
  var shop = mongoose.model('Shop', shopItemSchema);  // get shop database

  shop.create({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    tags: req.body.tags,
    hidden: req.body.hidden,
    seller: req.body.seller,
    _id: id
  })
  */
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