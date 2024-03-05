const express=require('express');
const bcrypt=require('bcrypt');
const session=require('express-session');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const cors=require('cors')
const mysql=require('mysql')
const app=express();
const port=8000;
app.use(session({
    key: "user",
    secret: "sample",
    resave: false,
    saveUninitialized: true,
    cookie: { expires: false }
  }))
  app.use(cookieParser())

const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Thirusha@psgtech",
    database:"eventmanagement"
})
con.connect();

app.use(cors({
    "origin":"*",
    "methods":["GET","POST","DELETE","UPDATE"],
    "credentials":true

}))
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
const user=require("./routes/user.js")
app.use('/users',user)
app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`)
})