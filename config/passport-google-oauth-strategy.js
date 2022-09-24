
const passport=require("passport");

const googleStrategy=require("passport-google-oauth").OAuth2Strategy;
const crypto=require("crypto");
const User=require("../models/user");

// tell passport to use a new strategy for user login

passport.use(new googleStrategy({
        clientID:"961506874878-mcnem935s6rnklla7ndvv0vaechd5hm0.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:3000/users/auth/google/callback"
    },
    function(accessToken,refreshToken,profile,done){
        // find a user
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("errot in google strategy passport ",err);
                return ;
            }

            

            if(user){
                // if found set the user as req.user
                return done(null,user);
            }
            else{
                // if not found, create the user and set it as req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){
                        console.log("error in cresting the user ",err);
                        return ;
                    }
                    return done(null,user);
                })
            }
        })
    }
)) 

module.exports = passport;