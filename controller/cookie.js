const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')
app.use(cookieParser())
// const set_cookie=(req,res)=>{
//      //res.setHeader('Set-Cookie','newUser=true')
//      //setting cookie
//      res.cookie('newUser',false)
//      res.cookie('isEmp',true,{maxAge:1000*60*60*24,secure:true,httpOnly:true}) //1day in millseconds
//      res.send('you got it')
// }

// const read_cookie=(req,res)=>{
//     const cookies=req.cookies
//     console.log(cookies);
//     res.json(cookies)
// }

module.exports={set_cookie,read_cookie}