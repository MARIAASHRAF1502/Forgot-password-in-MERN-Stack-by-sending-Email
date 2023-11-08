var express = require('express');
var app = express();
var cors = require('cors');
const bodyparser =require('body-parser');
const urlencodedParser = bodyparser.urlencoded( { extended : true}) ;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require("dotenv").config();
const ejs = require('ejs');
var nodemailer = require('nodemailer');

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

// jwt secret Key...!
const secret = "hellokskdjfnakjs";




// connect to the Database
mongoose.connect("mongodb://127.0.0.1:27017/forgetPassword").then(()=>
{
    console.log("connected to Database successfully!");
});



app.use(cors());
app.use(express.json());       


const mongomodel = mongoose.Schema(
    {
        emailid:{
            type:String,
            required:true
        },
        pwd:{
            type:String,
            required:true
        }
    }
);

const userDetails = mongoose.model('userDetails',mongomodel);


// registration form...!
app.post('/register',cors(),urlencodedParser,async (req,res)=>
{
    var emailcheck = await userDetails.findOne( { emailid : req.body.emailid });
    if(emailcheck){
        return res.json({msg : "Email id already exist"});
    }

   
    var encryptPwd = await bcrypt.hash(req.body.pwd,10);

    const user = new userDetails({
        emailid : req.body.emailid ,
        pwd: encryptPwd
    });


    user.save();
    res.json({ msg : "Registered Successfully"});

});


// login Request...
app.post("/login",cors(),urlencodedParser,async (req,res)=>
{
    var emailcheck = await userDetails.findOne( { emailid : req.body.emailid });

    if(!emailcheck){ 
        return res.json({msg : "Email id not registered"});
    }

    var pwd = await bcrypt.compare(req.body.pwd,emailcheck.pwd);
    if(!pwd){
        return res.json({msg : "Wrong Password"});
    }

    res.send({msg : "Success Login"});



});





// Forget Password....
app.post("/forgetpwd",async (req,res)=>
{
    var emailcheck = await userDetails.findOne( { emailid : req.body.emailid });

    if(!emailcheck){
        return res.send("Email id not found");
    }

   

    const token = jwt.sign({email:emailcheck.emailid}, secret, { expiresIn:"1h"});
    const link = `http://localhost:8000/reset-password/${emailcheck.emailid}/${token}`;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'afez1502@gmail.com',
        //   pass: //enter your pass key generated for the above email account,
          pass: 'akaijzsxvzbcgrbt'
        }
      });

    var mailOptions = {
        from: 'afez1502@gmail.com',
        to: 'mariaashraf1502@gmail.com',
        // to : req.body.emailid,
        subject: 'Password Recovery Email',
        text: link
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    process.env.EMAIL = emailcheck.emailid;
    console.log("Env data : "+process.env.EMAIL);

    console.log(link);
    res.send(link);
}
);


app.use(express.static(__dirname));



  
  
  
  


app.get("/reset-password/:email/:token", async (req,res)=>
{
    const email = req.params.email;
    const token = req.params.token;


    if(process.env.EMAIL != email){
        return res.send("Invalid link");
    }

    try{
        const tokenCheck = jwt.verify(token,secret);
    }catch(err){
        return res.send("Invalid link token "+err);
    }

    const emailid = process.env.EMAIL;
    
    console.log("name is : "+emailid);
    // instead storing the emailid in env file, just get the email id  from the link and send to client once after successfull verification...
    res.render(__dirname+'/passwordResetForm.ejs',{emailid});
});


app.post("/request",cors(),urlencodedParser,async (req,res)=>
{

    var encryptPwd = await bcrypt.hash(req.body.pwd,10);

    const user = await userDetails.updateOne( { emailid : req.body.emailid}, { $set : {pwd : encryptPwd}});
    
    
    // console.log("Change pwd request received..!");
    // console.log(req.body);
    res.json({msg:"success"});

});


app.listen(8000,()=>
{
    console.log("server run at port 8080");
})
