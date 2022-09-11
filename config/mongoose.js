const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/codeialDB");

const db=mongoose.connection;

db.on("error",console.error.bind(console,"Error Connecting to Mingo DB"));

db.once("open",function(){
    console.log("Connected to Database : MongoDB");
})

module.exports = db;