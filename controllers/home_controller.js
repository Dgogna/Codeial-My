const Post=require("../models/post");
const User=require("../models/user");

module.exports.home= async function(req,res){

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate("user")
        .populate({
            path:"comments",
            populate:{
                path:"user"
            }
        });
        let users=await User.find({});
    
        return res.render("home",{
            title:"Codeial | Home",
            posts:posts,
            all_users:users
        });
    }
    catch(err){
        console.log("error is " , err);
        return ;
    }

    
    // .exec(function(err,posts){
    //     if(err){
    //         console.log("error in fetching the posts");
    //         return ;
    //     }
    //     // console.log(posts);
    //     User.find({},function(err,users){
    //         return res.render("home",{
    //             title:"Codeial | Home",
    //             posts:posts,
    //             all_users:users
    //         });
    //     })
        
    // });
    
}