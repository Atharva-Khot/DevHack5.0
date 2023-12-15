//jshint esversion:6
// require('dotenv').config();
const express=require("express")
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');

const bcrypt=require("bcryptjs");
const salt=bcrypt.genSaltSync(11);


const app=express();
const PORT=3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');


//*************************** */
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser : true});
const userSchema=new mongoose.Schema({
    email:String,
    password:String,
});


//when save password encrpts and when find kicks password decrypts auto
//here we use extra layer for encryption by storing our encrpting message in .env file
// const secret=process.env.SECRET;

const User=new mongoose.model("User",userSchema);



app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/logout",(req,res)=>{
    res.render("home");
});

app.get("/submit",(req,res)=>{
    res.render("submit");
}); 


app.post("/register", async (req, res) => {
    const hash=bcrypt.hashSync(req.body.password,salt);

    const newUser = new User({
        email: req.body.username,
        password: hash,
    });

    try {
        await newUser.save();
        res.render("secrets");
    } catch (err) {
        console.error(err);
        // Handle the error, for example, send an error response to the client
        res.status(500).send("Internal Server Error");
    }
});


app.post("/login",async(req,res)=>{
    const password=(req.body.password);
    const username=req.body.username;
console.log(password);
    try{
        const data=await User.findOne({email:username});
        if(data){
            console.log("data: ",data);
            if(data.password===bcrypt.hashSync(password,salt)){
                res.render("secrets");
            }else{
                res.render("home");
            }
        }
    }catch(err){
        console.sendStatus(404);
    }
})


app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT} `);
});