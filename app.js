require('dotenv').config();
const express = require('express');


const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const cron = require('node-cron');
const MongoDbStore = require('connect-mongo')(session);

//Database Connection

mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
const passport = require('passport');
const Emitter = require('events');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Database Connected');
})
.catch(err=>{
    console.log('Connection Failed');
});
const PORT = process.env.PORT || 3000;

//Session store

let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

//Event Emitter

const eventEmitter = new Emitter()

app.set('eventEmitter',eventEmitter);

//Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} // life 24 hrs

}));

app.use(flash());



//Passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

//Global Middleware
    app.use((req,res,next) => {

        res.locals.session = req.session;
        res.locals.user = req.user
        next();
    });


//Assets
app.use(express.static('public'));


require('./routes/routes')(app);


//Cron


 



app.use((req,res) => {

    res.status(404).send('<h1>404, Page not found');
});







const server = app.listen(PORT,()=>{
    console.log("Running on 3000 port");
});


//Socket

