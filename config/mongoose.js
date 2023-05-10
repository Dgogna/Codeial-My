const mongoose=require("mongoose");
// mongodb+srv://admin-dhruv:Test123@cluster0.zmald.mongodb.net/todolistDB
// mongoose.connect("mongodb://localhost:27017/codeialDB");
mongoose.connect("mongodb+srv://admin-dhruv:Test123@cluster0.zmald.mongodb.net/socialmediaDB");

const db=mongoose.connection;

db.on("error",console.error.bind(console,"Error Connecting to Mingo DB"));

db.once("open",function(){
    console.log("Connected to Database : MongoDB");
})

module.exports = db;