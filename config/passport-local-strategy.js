const passport=require("passport");
const User = require("../models/user");

const LocalStrategy=require("passport-local").Strategy;

// passport uses the local strategy to find the user who is signed in 
passport.use(new LocalStrategy({
    usernameField:"email",
    passReqToCallback:true
    },
    function(req,email,password,done){
        // find the user and establish its identity
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash("error",err);
                return done(err);
            }
            if(!user || user.password!=password){
                req.flash("error","Invalid/Username Passoword");
                return done(null,false);
            } 
            return done(null,user);
        })
    }
));

// serializing the user to decide which key is to be used in the cookies


passport.serializeUser(function(user,done){
    return done(null , user.id);
})


// deserializing the user from the cookies

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("error in findint the user ---> passport");
            return done(err);
        }
        return done(null,user);
    })
})


// check if the user is authenticated or not

passport.checkAuthentication=function(req,res,next){
    // if the user is signed in then pass over the request to the next function which is controller action 
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect("/users/sign-in")
    }
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current user from the session cookie and we are doing its avaulability for the locals in views

        res.locals.user=req.user;
    }
    next();
}


module.exports = passport

