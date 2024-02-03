//jshint esversion:6
const express=require("express")
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');

const app=express();
const PORT=3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');


//*************************** */
mongoose.connect("mongodb://localhost:27017/devHack",{useNewUrlParser : true});
const userSchema=new mongoose.Schema({
    userId:String,
    password:String,
});


//when save password encrpts and when find kicks password decrypts auto
const secret="Thisisarandomlineforencryption.";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);



app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register_new");
});

app.get("/logout",(req,res)=>{
    res.render("home");
});

app.get("/submit",(req,res)=>{
    res.render("submit");
}); 

app.get("/menu",(req,res)=>{
    res.render("slider_loop");
})



app.post("/register", async (req, res) => {
    const userN = req.body.username;
    const pwd = req.body.password;

    const newUser = new User({ 
        userId: userN,
        password: pwd,
    });

    try {
        await newUser.save();
        res.render("navbar",{name:userN});
    } catch (err) {
        console.error(err);
        // Handle the error, for example, send an error response to the client
        res.status(500).send("Internal Server Error");
    }
});

app.post("/login", async (req, res) => {
    const password = req.body.password;
    const username = req.body.username;

    try {
        const user = await User.findOne({ userId: username });

        if (user) {
            if (user.password === password) {
                res.render("navbar",{name:username}); // Render the secrets page if the password matches
            } else {
                res.render("home"); // Render the home page if the password doesn't match
            }
        } else {
            console.error(err);
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error"); // Handle internal server errors
    }
});


app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT} `);
});