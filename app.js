//jshint esversion:6
const express=require("express")
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');

const app=express();
const PORT=3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');


//*************************** */
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser : true});
const userSchema={
    email:String,
    password:String,
};
const User=new mongoose.model("User",userSchema);


currentUserId=1;
users=[];

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


    //mongoose does not accept a callback so we need to use try and catch using awiat and async ****
    // await User.findOne({email:username},function(err,foundUser){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         if(foundUser){
    //             if(foundUser.password === password){
    //                 res.render("secrets");
    //             }
    //             else{
    //                 res.render("home");
    //             }
    //         }
    //     }
    // })

    try{
        const data=await User.findOne({email:username});
        console.log(data);
        
                if(data){
                    if(data.password === password){
                        res.render("secrets");
                    }
                    else{
                        res.render("home");
                    }
                }
    }catch(err){
        res.sendStatus(404).send(err);
    }
})


app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT} `);
});