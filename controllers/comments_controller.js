const Comment=require("../models/comment");
const Post=require("../models/post");
// const commentsMailer=require("../mailers/comments_mailer");

module.exports.create=async function(req,res){

    try{

        let post=await Post.findById(req.body.post);

        if(post){
            let comment=await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
            post.comments.push(comment);
            post.save();
            // comment=await comment.populate('user','name email');
            // console.log(comment);
            // console.log(comment);
            // commentsMailer.newComment(comment);

            req.flash("success","comment added SuccesFully");
            return res.redirect("/");  
        }

    }catch(err){
        console.log("error", err);
        return ;
    }

}

module.exports.destroy=async function(req,res){

    try{

        let comment =await Comment.findById(req.params.id);

        if(comment.user==req.user.id){
            const post_id=comment.post;
            comment.remove();
            let post=await Post.findByIdAndUpdate(post_id,{$pull:{comments:req.params.id}});
            req.flash("error","comment deleted");
            return res.redirect("back");
            
        }
        else{
            res.redirect("back");
        }

    }catch(err){
        console.log("error",err);
        return ;
    }

    
}