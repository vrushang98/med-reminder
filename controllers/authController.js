const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PWD
    }
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
function authController()
{
    return {

        login(req,res)
        {
            res.render('login');
        },
        async postLogin(req,res,next)
        {

            console.log('Inside login');
            const {email,password} = req.body;
            console.log(email);
            console.log(password);
            if(!email || !password)
            {
                req.flash('error','All Fields are required');


                return res.redirect('/login');
            }
            
            if(!validateEmail(email))
            {
                req.flash('error','Email is Invalid');
                return res.redirect('/login');
            }

            passport.authenticate('local',(err,user,info) => {
                console.log(user);
                if(err)
                {
                    console.log(err);
                    req.flash('error','Something Went Wrong');
                    return next(err);
                }

                if(!user)
                {

                    req.flash('error','Invalid Username and Password');
                    return res.redirect('/login');
                }

                req.logIn(user,(err) => {
                    if(err)
                    {
                        req.flash('error','Invalid Username and Password');
                        return next(err);
                    }

                    req.flash('success','Logged In');
                    return res.redirect('/');
                });
            })(req,res,next);
        },
        register(req,res){
            res.render('register',{CLIENT_KEY:process.env.CLIENT_KEY});
        },
        async postRegister(req,res,next)
        {
            console.log('Inside postRegister');
            const {email,password,name,phone,age} = req.body;

            if(!name || !email || !password || !phone || !age)
            {
                console.log('Not correct fields');
                // req.flash('error','All fields are required');
               
                // return res.redirect('/register');                
                return res.status(200).json({'success':false,error:'Please Enter Correct Details'});
            }
            else
            {
                if(password.length<8)
                {
                // req.flash('error','Password length should be greater than 8');
                // req.flash('name',name);
                // req.flash('email',email);
                // req.flash('phone',phone);
                // req.flash('age',age);

                return res.status(200).json({'success':false,'type':'password',error:'Password length should be greater than 8'});
                // res.redirect('/register');
                }
                else if(phone.length!=10)
                {
                    // req.flash('name',name);
                    // req.flash('email',email);
                    // req.flash('password',password);
                    // req.flash('age',age);
                    // req.flash('error','Invalid mobile number');

                    return res.status(200).json({'success':false,'type':'mobile',error:'Invalid Mobile Number'});
                    // res.redirect('/register');   
                }
                else
                {


                    const captchaVerification = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SERVER_KEY}&response=${req.body.token}`,
                    {
                        method:'POST'
                    }).then(response => response.json())
                    // .then(google_response => res.json({ google_response }))
                    // .catch(error => res.json({ error }));

                    console.log(captchaVerification);
                    
                    if(captchaVerification.success === true)
                    {
                        User.exists({email:email.toLowerCase()},(err,result)=>{
                            if(result)
                            {
                                console.log('User exist');
                                // req.flash('error','Email already taken');
                                // req.flash('name',name);
                                // req.flash('email',email);
                                // return res.redirect('/register');
                                return res.status(200).json({'success':false,'type':'taken',error:'User Already Exist Try to Login'});
                            }
                        });
            
                        const hashedPassword = await bcrypt.hash(password,10);
                        const userSchema = new User({
                            name,email:email.toLowerCase(),password:hashedPassword,phone,age
                        });
            
                        
                        userSchema.save().then(user => {
                            //Login
                            if(user)
                            {
                                // req.flash('success','Registered Successfully');
                                // return res.redirect('/login');
                                return res.status(200).json({'success':true,'type':'done',msg:'Registered Successfully'});
                            }
                           
                        }).catch(err => {
                            
                            return res.status(200).json({'success':false,'type':'taken',error:'Something went wrong'});
                        });
                    }
                    else
                    {
                        return res.status(200).json({'success':false,'type':'taken',error:'Invalid Captcha'});
                    }
                   
                }
            }

            // Check if email exists
            
        },
        async getProfile(req,res)
        {
            const profile = await User.findById({_id:req.user._id}).select("-password -_id").lean();
            console.log(profile);
            res.render('profile',{profile});
        },
        async postProfile(req,res)
        {
            const {email,name,phone,age} = req.body;

            if(!name || !email || !phone || !age)
            {
                console.log('Not correct fields');
                req.flash('error','All fields are required');
               
                return res.redirect('/register');                
            }
            else
            {
               if(phone.length!=10)
                {
                    // req.flash('name',name);
                    // req.flash('email',email);
                    // req.flash('password',password);
                    // req.flash('age',age);
                    req.flash('error','Invalid mobile number');
                    res.redirect('/profile');   
                }
                else
                {
                    const profile = await User.findById({_id:req.user._id});

                    profile.email = email;
                    profile.name = name;
                    profile.phone = phone;
                    profile.age = age;

                    profile.save().then(user => {
                        if(user)
                        {
                            req.flash('success','Profile Updated');
                            return res.redirect('/profile');
                        }
                    }).catch(err => {
                        req.flash('error','Something went wrong');
                        return res.redirect('/profile');
                    });
                }
            }
        },
        async changePWD(req,res)
        {
            res.render('change_pwd');
        },
        async postChangePWD(req,res)
        {
           let newPassword = req.body.newPassword;
           let confirmPassword = req.body.confirmPassword;
           console.log(newPassword);
           console.log(confirmPassword);

           if(newPassword != confirmPassword)
           {
               req.flash('error','Incorrect Confirm Password');
               return res.redirect('/change_pwd');
           }
           else
           {

            if(newPassword.length<8)
            {
                req.flash('error','password length should be greater than 8');
                res.redirect('/change_pwd');
            }
            else
            {
                User.findById({_id:req.user._id}).then( user => {



                    if(!user)
                    {
                        return res.redirect('/login');
                    }
                    else
                    {
                        console.log('Current:',req.body.currentPassword);
                        console.log('DB:',user.password);
                        User.comparePassword(req.body.currentPassword,user.password,function(err,isMatch){
                            if(err) throw err;
                            if(isMatch)
                            {
                                
                                bcrypt.genSalt(10, function(err, salt) {
                                    bcrypt.hash(req.body.newPassword.toString(), salt, function(err, hash) {
                                        // Store hash in your password DB.
                                        newPassword=hash;
                                        User.updateOne({_id:req.user._id},{$set:{password:newPassword}}).then((docs)=>{
                                            req.flash('success','Password Changed');
                                            res.redirect('/profile');
                                        });
                                    });
                                });
                            }
                            else{
                                req.flash('error','Invalid Password');
                                            res.redirect('/change_pwd');
                            }
                        });
                    }
                });
            }
           
           }
           
                
                
           
        },

        async forgotPWD(req,res)
        {
            res.render('forgotPWD');
        },
        async resetPWD(req,res)
        {
            console.log('Reset Password-------------------------------------------');
            console.log(req.body);
            crypto.randomBytes(32,(err,buffer)=>{
                if(err)
                {
                    console.log(err);
                }
                const token = buffer.toString("hex")
                User.findOne({email:req.body.email.toLowerCase()})
                .then(user=>{
                    if(!user)
                    {
                        req.flash('success','User doesnot exist');
                        res.redirect('/forgot_password');
                    }
                    user.resetToken=token;
                    user.expireToken= Date.now() + 3600000;
                    user.save().then((result)=>{
                       console.log(`
                       <p>You requested for password reset</p>
                       <h5>Click on this link <a href="http://65.0.127.254/reset/${token}">Link</a> to reset password</h5>
                   `);
                        transporter.sendMail({
                            to:user.email,
                            from:process.env.EMAIL,
                            subject:"password reset",
                            html:`
                                <p>You requested for password reset</p>
                                <h5>Click on this link <a href="http://65.0.127.254/reset/${token}">Link</a> to reset password</h5>
                            `
                        },function(err,info)
                        {
                            if(err)
                                console.log(err);
                            else
                                console.log('Email sent:'+info.response);
                        });
        
                        req.flash('success','Check Your Email Box');
                        return res.redirect('/login');
                    })
                })
        
            })

        },
        async getNewPWD(req,res)
        {
            const {token} = req.params;
            console.log('Token:',token);
            res.render('newPWD',{token});
        },
        async postNewPWD(req,res)
        {
            const newPassword=req.body.password;

            const sentToken = req.body.token;
            User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
            .then((user)=>{
                if(!user)
                {
                    req.flash('error','Try again session expired');
                    return res.redirect('/login');
                    
                }
                bcrypt.hash(newPassword,12).then(hashedPassword=>{
                    user.password=hashedPassword;
                    user.resetToken=undefined;
                    user.expireToken=undefined;
                    user.save().then(saveduser=>{
                        req.flash('success','Password Updated Successfully');
                        return res.redirect('/login');
                    })
                    .catch(err=>{
                        console.log(err);
                    });
                })
                .catch(err=>{
                    console.log(err);
                });
            });
        }
    };
}



module.exports=authController;