const express = require('express');
const app = express();
const helper=require('./helper/authHelper')
const jwt=require("jsonwebtoken")
const cookieParser = require('cookie-parser');
// Use cookie-parser middleware
app.use(cookieParser());

// middleware
app.use(express.static('public'));
app.use(express.json())
// view engine
app.set('view engine', 'ejs');

app.get("*",helper.check_user)
app.get('/', (req, res) => res.render('home'));
app.get('/starbucs',helper.requireAuth ,(req, res) => res.render('starbucs'));

// app.get('/set-cookies',require('./controller/cookie').set_cookie)
// app.get('/read-cookies',require('./controller/cookie').read_cookie)

app.use('/',require('./routes/authRoutes'))
app.listen(3000,()=>{
    console.log(`listening on port 3000`);
})