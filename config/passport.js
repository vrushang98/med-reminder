const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const bcrypt = require('bcrypt');


function init(passport)
{


    passport.use('local',new LocalStrategy({usernameField:'email'},async (email,password,done) => {


        const user = await User.findOne({email:email});
        console.log("from passport:",user);
        console.log(email,':',password);
        if(!user)
        {
            return done(null,false,{message:'No user exist with this email'});
        }
        

        bcrypt.compare(password,user.password).then(match => {
            console.log('Password:',password);
            console.log('USer:',user.password);
            if(match)
            {
                return done(null,user,{message:'Logged in Successfully'});
            }
            return done(null,false,{message:'Wrong Username or Password'});
        }).catch(err => {
            return done(null,false,{message:'Something Went Wrong'});
        });
    }));

    passport.serializeUser((user,done) => {
        done(null,user._id);
    });

    passport.deserializeUser((id,done) => {
        User.findById(id, (err,user) => {
            done(err,user);
        });
    });
}

module.exports=init;