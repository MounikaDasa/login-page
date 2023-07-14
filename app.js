//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const md5=require("md5");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);




app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
const new_user=User({
    email:req.body.username,
    password:md5(req.body.password)
});
new_user.save()
res.render("secrets")
})

app.post("/login",function(req,res){
    const get_email=req.body.username;
    const get_pswd=md5(req.body.password);
    User.findOne({email:get_email}).then(function(details){
        if(details){
            if(details.password===get_pswd){
                res.render("secrets")
            }
        }
    })
    .catch(function(err){
        console.log(err)
    })
})

app.listen(3000,function(res){
    console.log("Server is listening to the port 3000")
})
