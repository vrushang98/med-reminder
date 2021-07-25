function auth(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }

    req.flash('error_msg','Your are not logged in');
    return res.redirect('/login');
}


function auth2(req,res,next)
{
    if(req.isAuthenticated())
    {

        req.flash('error_msg','Your are already logged in');
        res.redirect('/');
    }
    else{
    // console.log(req);
        return next();
    }
}

function nocache(req, res, next) {
    try
    {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports.isAuthenticated=auth;
module.exports.isAuthenticated2=auth2;
module.exports.nocache = nocache;