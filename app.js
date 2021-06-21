//jshint esversion:6
const express = require('express');
const mongoose = require('mongoose');
const  encrypt = require('mongoose-encryption');
const ejs = require("ejs");
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

app.use(express.urlencoded());

//
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const secret = 'Tthisisourlongsecretpass';
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);




//setup ejs
app.set("view engine", "ejs")


//using static files 

app.use(express.static("public"));

app.get('/', (req, res)=>{
    res.render('home')
})
app.get('/login', (req, res)=>{
    res.render('login')
})
app.get('/register', (req, res)=>{
    res.render('register')
})
app.post('/register', (req, res)=>{
   const newUser = new User ({
       username: req.body.username,
       password: req.body.password
   });

   newUser.save((err)=>{
       if(err){
           console.log(err)
       }else{
           res.render('secrets')
       }
   });

})
app.post('/login', (req, res)=>{
   const username   = req.body.username;
   const password = req.body.password;
 
   User.findOne({username: username}, (err, foundUser)=>{
       if(err){
           console.log(err)
       }else{
           if(foundUser){
               if(foundUser.password === password){
                   res.render('secrets')
               }
           }
       }
   })


})


app.listen(port, ()=>{
    console.log(`Server runs on  http://localhost:${port}`);
})