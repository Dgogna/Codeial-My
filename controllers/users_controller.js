const User = require("../models/user");
const fs=require("fs");
const path=require("path");

module.exports.profile=function(req,res){
    // console.log(req.params.id);
    User.findById(req.params.id,function(err,user){
        // console.log(user);
        return res.render("user-profile",{
            title:"codeial/Profile",
            profile_user:user
        })
    })
    
}

module.exports.update=async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id,{
    //         name:req.body.name,
    //         email:req.body.email
    //     },function(err,user){
    //         return res.redirect("back");
    //     })
    // }else{
    //     res.status(401).send("unauthoarized");
    // }

    if(req.user.id == req.params.id){
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("*****Multer Error" , err);
                }
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){

                    if(user.avatar){
                        // fs.access(path.join(__dirname,"..",user.avatar),function(error){
                        //     if(!error){
                        //         console.log("avtar  exist");
                                fs.unlinkSync(path.join(__dirname,"..",user.avatar));
                        //     }
                        //     else{
                        //         console.log("avtar dont exist");
                        //     }
                        // })
                        // fs.unlinkSync(path.join(__dirname,"..",user.avatar));
                    }

                    user.avatar=User.avatarPath+"/"+req.file.filename;
                }
                user.save();
                return res.redirect("back");
            })
        }catch(err){
            req.flash("error",err);
            return res.redirect("back");
        }
    
    }else{
        return res.status(404);
    }

}

// for sign up 
module.exports.signUp=function(req,res){

    if(req.isAuthenticated()){
        return res.redirect("/users/profile");
    }

    return res.render("user_sign_up",{
        title:"Sign up"
    })
};

// for sign in
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        // console.log(req.user.id);
        var user_id=req.user.id
        return res.redirect("/users/profile/"+user_id);
    }
    return res.render("user_sign_in",{
        title:"Sign in"
    })
};

// for signing up or to create a new user

module.exports.create=function(req,res){
    // todo later

    if(req.body.password != req.body.confirm_password){
        // console.log("pass not matched");
        return res.redirect("back");
    }

    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("error in finding user in signing up");
            return ;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log("error in creating the user");
                    return ;
                }
                return res.redirect("/users/sign-in")
            })
        }else{
            return res.redirect("back");
        }
    })

}

// get the sign in data

module.exports.createSession=function(req,res){
    // todo later
    req.flash("success","Logged in Succesfully");
    return res.redirect("/");
}

module.exports.destroySession=function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success","You have logged out!");
        return res.redirect('/');
      });
    // req.logout();
    // req.session.destroy(function (err) {
    //     return res.redirect('/');
    //   });
    // return res.redirect("/");
}