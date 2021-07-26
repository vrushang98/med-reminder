const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserScheme = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date
});

module.exports = mongoose.model('User',UserScheme);



module.exports.comparePassword=function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        // res === true
        // console.log('comparepassword');
      
        if(err) {console.log(err);};
        callback(null,isMatch);
    });
    
};
