//jshint esversion:6
require('dotenv').config();
const express=require("express")
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');

const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require("passport-local-mongoose");

const GoogleStrategy=require("passport-google-oauth20").Strategy;
const findOrCreate=require("mongoose-findorcreate");

const app=express();
const PORT=3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');


app.use(session({
    secret:"My adsfsdd kbjk",
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());

//*************************** */
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser : true});
const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    googleId:String,
    secret:String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
   
passport.deserializeUser(function(user, done) {
    done(null, user);
  });


passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function(accessToken,refreshToken,profile,cb){
        console.log(profile);
        User.findOrCreate({googleID:profile.id},function(err,user){
            return cb(err,user);
        });
    }
));


app.get("/",(req,res)=>{
    res.render("home");
});


//this will hang app.js *****wrong way
// app.get("/auth/google",(req,res)=>{
//     passport.authenticate("google",{scope:["profile"]})
// });

//Right WAY **
app.get("/auth/google", passport.authenticate('google', {

    scope: ['profile']

}));

app.get("/auth/google/secrets",
    passport.authenticate('google',{failureRedirect:"/home"}),
    function(req,res){
        res.redirect("/secrets");
    }
);

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/logout",(req,res)=>{
    // req.logout();
    // res.render("/");
    req.logout(function(err){
        if(err) return next(err);
        else res.render("home");
    });
});

app.get("/submit",(req,res)=>{
    // res.render("submit");
    if(req.isAuthenticated()){
        res.render("submit");
    }else res.render("/logins");
}); 

app.get("/secrets", async (req, res) => {
    try {
      const foundUsers = await User.find({ "secret": { $ne: null } }).exec();
      console.log("Secrets foundUser",foundUsers);
      res.render("secrets", { usersWithSecrets: foundUsers });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  
// "find" funtions do not accept callback so we need to change these into try and catch
// app.post("/submit",async(req,res)=>{
//     const submittedSecret=req.body.secret;
//     console.log(req.user);
//     User.findById(req.user.id,function(err,foundUser){
//         if(err){
//             console.log(err);
//         }else{
//             if(foundUser){
//                 foundUser.secret=submittedSecret;
//                 foundUser.save(function(){
//                     res.redirect("/secrets");
//                 });
//             }
//         }
//     });

// });


app.post("/submit", async (req, res) => {
    try {
      const submittedSecret = req.body.secret;
    //   console.log(req.user);
    // console.log("1","req.user",req.user);
  
      // Using async/await with findById
      const foundUser = await User.findById(req.user._id).exec();
//   console.log("2",foundUser);
      if (foundUser) {
        foundUser.secret = submittedSecret;
        await foundUser.save();
        res.redirect("/secrets");
        console.log("3");
      }else{
        res.redirect("/login");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  

app.post("/register", async (req, res) => {
    User.register({username:req.body.username},req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect("/secrets");
            });
        }
    });
});


app.post("/login",async(req,res)=>{
    const user=new User({
        username:req.body.username,
        password:req.body.password,
    });
    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets");
            });
        }
    });
})


app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT} `);
});