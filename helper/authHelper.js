const express=require('express')
const app = express();
const jwt=require("jsonwebtoken")
const cookieParser = require('cookie-parser');
const {PrismaClient}=require("@prisma/client")
const prisma=new PrismaClient()
// Use cookie-parser middleware
app.use(cookieParser());

const requireAuth=(req,res,next)=>{
     const token=req.cookies.jwt
    //  check is token exists and verify
     if(token)
     {
        jwt.verify(token,'secret',(err,decodedToken)=>{
          if(err)
          {
               console.log(err.message);
               res.redirect('/login')
          }
          else
          {
               console.log(decodedToken);
               next()
          }
        })
     }
     else
     {
        res.redirect('/login')
     }
}

//check current user

const check_user=async(req,res,next)=>{
     const token=req.cookies.jwt
     if(token)
     {
          jwt.verify(token,'secret',async(err,decodedToken)=>{
               if(err)
               {
                    res.locals.user=null
                    console.log(err.message);
                    next()
               }
               else
               {
                    console.log(decodedToken);
                    const user=await prisma.userSchema.findFirst({
                         where:{
                            id:decodedToken.id
                         }
                    })
                    res.locals.user=user
                    next()
               }
             })
     }
     else
     {
          res.locals.user=null
          next()
     }
}
module.exports={requireAuth,check_user}