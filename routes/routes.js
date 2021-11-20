
const User = require('../models/user');
const rateLimiter = require('express-rate-limit');
const authController = require('../controllers/authController');
const medController = require('../controllers/medController');
const {isAuthenticated,isAuthenticated2,nocache} = require('../middleware/auth');


const apiLimit = rateLimiter({
    windowMs:15*60*1000,
    max:5
});




function initRoutes(app){


    //Auth Routes
    app.get('/login',nocache,isAuthenticated2,authController().login);
    app.post('/login',nocache,isAuthenticated2,authController().postLogin);

    app.get('/register',nocache,isAuthenticated2,authController().register);
    app.post('/register',nocache,apiLimit,isAuthenticated2,authController().postRegister);
    //Forgot Password
    app.get('/forgot_password',nocache,isAuthenticated2,authController().forgotPWD);

    app.post('/reset_password',nocache,isAuthenticated2,authController().resetPWD);

    app.get('/reset/:token',nocache,isAuthenticated2,authController().getNewPWD);
    app.post('/new_password',nocache,isAuthenticated2,authController().postNewPWD);





    
    app.post('/add_medicine',nocache,medController().addMedicine);
    app.post('/search_medicine',nocache,isAuthenticated,medController().searchMedicine);
    app.get('/edit_medicine/:med',nocache,isAuthenticated,medController().editMedicine);
    app.post('/update_medicine',nocache,isAuthenticated,medController().updateMedicine);
    app.get('/delete_medicine/:med',nocache,nocache,isAuthenticated,medController().deleteMedicine);
    app.get('/allowEdit',nocache,isAuthenticated,medController().allowEditMedicine);


    app.get('/profile',nocache,isAuthenticated,authController().getProfile);

    app.post('/update_profile',nocache,isAuthenticated,authController().postProfile);


    app.get('/change_pwd',nocache,isAuthenticated,authController().changePWD);
    
    app.post('/change_pwd',nocache,isAuthenticated,authController().postChangePWD);
    app.get('/',nocache,isAuthenticated,medController().showMedicine);

    // app.get('/cron_test',isAuthenticated,medController().cronTest);




    
    app.get('/logout',nocache,isAuthenticated,(req,res) => {
        req.logout();
        return res.redirect('/login');
    });
}



module.exports=initRoutes;