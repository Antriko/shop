var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const fs = require('fs');

var multer  = require('multer');  // middleware for file uploading (multipart/form-data)
var upload = multer({ dest: 'images/tmp/'});  // where images will be held

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


// swagger + swagger JSDoc
const swaggerUi = require('swagger-ui-express');

const swaggerJSDoc = require('swagger-jsdoc');
const options = {
  definition: {
    info: {
      title: 'Shop API', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: ['app.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs.json', (req, res) => { // to see the raw json if needed
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec)); // show spec


// jwt
var jwt = require('jsonwebtoken');
var private = 'pRiVaTeKeY'; // Can be set in .env and retrieved with process.env.KEY or whatever the string name is set to


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

var base64ImageSchema = new mongoose.Schema({
  base64: String,       // the image is stored as base64
  owner: String,        // which item shop the image is linked to
  mimetype: String      // what type of file it is (png/jpg)
})

// connecting to localhost mongodbfgdhayeh
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
});

// create user
/**
 *  @swagger
 *  /user/create:
 *    post:
 *      tags:
 *        - user
 *      description: Create a user
 *      parameters:
 *        - name: username
 *          in: formData
 *          description:  Username to use for login
 *          required: true
 *        - name: password
 *          in: formData
 *          description:  Username to use for login
 *          required: true
 *      responses:
 *        200:
 *          description: User created
 *        400:
 *          description: Username already exists 
 *      consumes:
 *        - application/x-www-form-urlencoded
 */
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
/**
 *  @swagger
 *  /user/login:
 *    post:
 *      tags:
 *        - user
 *      description: Login to user
 *      parameters:
 *        - name: username
 *          in: formData
 *          description:  Username to use for login
 *          required: true
 *        - name: password
 *          in: formData
 *          description:  Username to use for login
 *          required: true
 *      responses:
 *        200:
 *          description: Valid login details
 *        400:
 *          description: Invalid password 
 *      consumes:
 *        - application/x-www-form-urlencoded
 */

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

// decode token
/**
 *  @swagger
 *  /user/verify:
 *    get:
 *      tags:
 *        - user
 *      description: Verify JWT and get decoded message
 *      security: []
 *      responses:
 *        200:
 *          description: Valid
 *        400:
 *          description: Invalid
 */
app.use('/user/verify', (req, res) => {
  // get token and see if the token is valid so that the user can continue with their action
  jwt.verify(req.cookies.token, private, (err, decoded) => {
    if (err){res.status(400).send('invalid');console.log(err); return;};  // if token is invalid, tell frontend that
    if (decoded) {  // get the data from the JWT so that 
      res.status(200).send(decoded);  // tells frontend that the JWT is valid
    }
  })
});



// multipart/form-data so needs multer
// Swagger is unable to send array of images so must stick with .single for testing purposes
/**
 *  @swagger
 *  /shop/create:
 *    post:
 *      tags:
 *        - store
 *      description: Add item to store
 *      parameters:
 *        - name: name
 *          in: formData
 *          required: true
 *          type: string
 *        - name: description
 *          in: formData
 *          required: true
 *          type: string
 *        - name: category
 *          in: formData
 *          required: true
 *          type: string
 *          enum: ['PS4', 'xBox', 'PC']
 *        - name: price
 *          in: formData
 *          required: true
 *          type: number
 *          description: in pence e.g. 100 = £1.00
 *        - name: image
 *          in: formData
 *          required: true
 *          type: file
 *        - name: tags
 *          in: formData
 *          required: true
 *          type: array
 *          items:
 *            type: string
 *        - name: hidden
 *          in: formData
 *          required: true
 *          type: boolean
 *        - name: author
 *          in: formData
 *          required: true
 *          type: string
 */
app.post('/shop/create', upload.single('image1'), (req, res) => {
  console.log(req.file);
  
  
  var img = fs.readFileSync(req.file.path);
  
  // unique ID for the image that has to be stored into the imageURL array also in the product
  id = new mongoose.Types.ObjectId();
  var image = mongoose.model('images', base64ImageSchema);
  image.create({
    base64: img.toString('base64'),
    mimetype: req.file.mimetype,
    _id: id
  });

  // add item to shop
  var shop = mongoose.model('Shop', shopItemSchema);  // get shop database
  
  shop.create({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    imageURL: [id],   // append more ids but this is for a single image for now due to Swagger limitations
    tags: req.body.tags,
    hidden: req.body.hidden,
    seller: req.body.seller,
  });

  res.sendStatus(200);
});

// get list of items within the category

app.use('/shop/category/:category', (req, res) => {
  console.log(req.params.category);
  var shop = mongoose.model('Shop', shopItemSchema);  // get shop database
  shop.find({category: req.params.category}, (err, docs) => {
    if (err) {console.log(err)};
    console.log(docs);
  })
});


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