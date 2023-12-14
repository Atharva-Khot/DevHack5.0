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
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser : true});
const userSchema=new mongoose.Schema({
    email:String,
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
    res.render("register");
});

app.get("/logout",(req,res)=>{
    res.render("home");
});

app.get("/submit",(req,res)=>{
    res.render("submit");
}); 

//this below commented code have issues of error handling 
// app.post("/register",async(req,res)=>{
//     const userN=req.body.username;
//     const pwd=req.body.password;

//     const newUser=new User({
//         email:userN,
//         password:pwd,
//     });

//     newUser.save(function(err){
//         if(err){
//             console.log(err);
//         }else{
//             res.render("secrets");
//         }
//     })
// });



app.post("/register", async (req, res) => {
    const userN = req.body.username;
    const pwd = req.body.password;

    const newUser = new User({
        email: userN,
        password: pwd,
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
    const password=req.body.password;
    const username=req.body.username;

    try{
        const data=await User.findOne({email:username});
        if(data){
            if(data.password===password){
                res.render("secrets");
            }else{
                res.render("home");
            }
        }
    }catch(err){
        console.send(404);
    }
})


app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT} `);
});