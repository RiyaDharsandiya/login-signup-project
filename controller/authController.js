const jwt=require("jsonwebtoken")
const nodemailer = require("nodemailer");
const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')
app.use(cookieParser())
const {PrismaClient}=require("@prisma/client")
const prisma=new PrismaClient()
const bcrypt = require('bcrypt')

const signup_get=(req,res)=>{
   res.render('signup')
}
const signup_post=async(req,res)=>{
   const{email,password}=req.body
   //find user in db if there then send user exists
   const user=await prisma.userSchema.findFirst({
      where:{
         email:email
      }
   })
   if(user)
   {
      return res.send({user:"user exists"})
   }
   //validate the email and password
   
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !(email.toLowerCase().endsWith('@gmail.com'))){
      return res.send({email:"Invalid Email"});
  }
  if(!password || password.length>=8 ||!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(password))
        {
            return res.send({password:"Invalid Password(1 alphabet and one number required)"});            
        }
   //hash password
   const hashedPassword = await bcrypt.hash(password, 10)
   //create new user
   try {
    const userData = await prisma.userSchema.create({
        data: 
        {
              "email":email,
              "password":password,
              "passwordHashed":hashedPassword
        },
      });
      //jwt token
      const token=create_token(userData.id,userData.email)
      // res.cookie('jwt',token,{httpOnly:true})
      res.cookie('jwt',token,{httpOnly:true,expiresIn:"1m"}).status(201).json({message:"signed up",data:userData})
   } catch (error) {
    console.error('Error inserting data:', error);
    res.status(400).json({message:"user not created"})
   }
}
const login_get=(req,res)=>{
   res.render('login')
}
const login_post=async(req,res)=>{
    const{email,password}=req.body
    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !(email.toLowerCase().endsWith('@gmail.com'))){
         return res.send({email:"Invalid Email"});
     }
     if(!password || password.length>=8 ||!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(password))
           {
               return res.send({password:"Invalid Password(1 alphabet and one number required)"});            
           }
      const user=await prisma.userSchema.findFirst({
         where:{
            email:email
         }
      })
      if(user)
      {
         const auth=await bcrypt.compare(password,user.passwordHashed)
         if(auth &&email==user.email)
         {
            //jwt token
            const token=create_token(user.id,user.email)
            // res.cookie('jwt',token,{httpOnly:true})
            return res.cookie('jwt',token,{httpOnly:true}).status(201).json({message:"logged in",data:user})
            
         }
         if(email!=user.email)
        {
         return res.send({email:"incorrect email "})
        }
        else
        {
         return res.send({password:"incorrect password "})
        }
      }
      else
      {
         return res.send({login:"user not registered"})
      }
    } catch (error) {
      return res.status(400).send({error:error}) 
    }
}

const create_token=(id,email)=>{
   return jwt.sign({id,email},'secret',{expiresIn:"1m"})
}

const logout_get=async(req,res)=>{
   res.cookie('jwt','',{maxAge:1})
   res.redirect('/')  //home page
}

const forgot_password_post=async(req,res)=>{
      const {email}=req.body
      const user=await prisma.userSchema.findFirst({
         where:{
            email:email
         }
      })
      console.log(user);
      if(!user)
         {
            return res.send({login:"user not registered"})
         }
      else
      {
      const transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                   user: "riyadharsandiya8620@gmail.com",
                   pass: "dpsujgdwtbwsxeqc"
               }
           });
         
           const mailOptions = {
               from: "shubhp1845@gmail.com",
               to: email,
               subject: "RESENDING YOUR PASSWORD",
               html: `<h1>Your password is ${user.password}</h1>`
           };
         
           transporter.sendMail(mailOptions, function (err, info) {
         
               console.log('Running');
               if (err) {
                   console.log(err);
               } else {
                   console.log('Mail sent:', info.response);
                   return res.send({message:"mail sent"})
               }
           });
         }
   
}
const forgot_password=async(req,res)=>{
   res.render('forget_pass')
}
module.exports={signup_get,signup_post,login_get,login_post,logout_get,forgot_password,forgot_password_post}