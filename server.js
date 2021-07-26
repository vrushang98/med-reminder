require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const MongoDbStore = require('connect-mongo');
const exphbs = require('express-handlebars');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// ----------------------DB Configs-----------------------------------
mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
const connection = mongoose.connection;

connection.on('open',()=>{
    console.log('Database Connected');
}).catch(err=>console.log(err));

// ----------------------Session Store--------------------------------
let mongoStore = MongoDbStore.create({
    mongoUrl:process.env.MONGO_CONNECTION_URL,
    collectionName:'sessions'
});


// -----------------------Session Config------------------------------

app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}
}));

// -----------------------Flash---------------------------------------
app.use(flash());


// ---------------------- Passport Config----------------------------


const passportInit = require('./config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


// ------------------------Global Middleware------------------------
app.use((req,res,next) => {

    res.locals.session = req.session;
    res.locals.user = req.user
    next();
});




// ------------------------View Engines---------------------------

  var hbs=exphbs.create({

    defaultLayout:'layout',
    helpers:{
      ifequal:function(a, b,options) {
        if (a == b) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },
      json:function(obj)
      {
        return JSON.stringify(obj);    
      }
    }
  });
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',hbs.engine);
app.set('view engine','handlebars');
app.use(express.static(path.join(__dirname,'public')));




//Cron



require('./cron');
require('./routes/routes')(app);
app.use((req,res) => {

  res.status(404).send('<h1>404, Page not found');
});



app.listen(PORT, () => {

    console.log(`Server running on ${PORT}`);
})