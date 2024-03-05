const express=require('express');
const bcrypt=require('bcrypt');
const session=require('express-session');
const bodyparser=require('body-parser');
const cookie=require('cookie-parser');
const cors=require('cors')
const mysql=require('mysql');
const cookieParser = require('cookie-parser');
const app=express();

app.use(session({
    key: "user",
    secret: "sample",
    resave: false,
    saveUninitialized: true,
    cookie: { expires: false }
  }))


const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Thirusha@psgtech",
    database:"eventmanagement"
})
con.connect();


const saltRounds=10
app.use(session({
    key: "user",
    secret: "sample",
    resave: false,
    saveUninitialized: true,
    cookie: { expires: false }
  }))
  app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

app.use(cookieParser());
const router=express.Router();
const checkSession = (req, res, next) => {
    // Check if session exists
    if (req.session && req.session.user) {
        // Session exists, continue to the next middleware/route handler
        next();
    } else {
        // Session doesn't exist, or user is not logged in
        res.status(401).json({ message: "Unauthorized" });
    }
};

router.post('/signup',(req,res)=>{
    bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
        role=req.body.role
        const sql='INSERT INTO Users (username,password,role) values(?,?,?)';
        const values=[req.body.username,hash,role.toUpperCase()]
        con.query(sql,values,(err)=>{
            if(err){
                res.json({Error:err})
            }
            else{
                res.json({message:"User created"})
            }
        })
    })

})

router.post('/signin',(req,res)=>{
    const sql1='SELECT * FROM Users where username=? ';
    const values1=[req.body.username];
    con.query(sql1,values1,(err,result)=>{
        if(err){
            res.json({Error:err})
        }
        else{
            if(result.length==0){
                res.json({Message:"Invalid user"})
            }
            else{
                console.log(result[0].password)
                console.log(req.body.password)
                bcrypt.compare(req.body.password,result[0].password,(err,result1)=>{
                    if(err){
                        res.json({Error:err})
                    }
                    else{
                        if(result1==true){
                            req.session.user=result1;
                            console.log(req.session.user);
                            res.json({Message:"Login success"})
                        }
                        else{
                            res.json({Message:"Invalid password"})
                        }
                    }
                  
            })
        }
    }})
   

    })

router.post('personalinfo',checkSession,(req,res)=>{
    const sql1='INSERT INTO Volunteerinfo (name,age,address) where username=?';
    const values1=[req.body.name,req.body.age,req.body.address,req.session.user[0].username]
    con.query(sql1,values1,(err)=>{
        if(err){
            res.json({Error:err})
        }
        else{
            const sql2='SELECT volunteerid from Volunteerinfo where username=?';
            const values2=[req.session.user[0].username]
            con.query(sql2,values2,(err)=>{
                if(err){
                    res.json({Error:err})
                }
                else{
                    res.json({})
                }
            })
        }
      

    })
})


module.exports=router;
