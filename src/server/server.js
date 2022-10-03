const express = require('express');
const db = require('./db')
const cors = require('cors')

const app = express();
const  PORT = 3002;
app.use(cors());
app.use(express.json())

app.post("/login", (req,res)=>{
    
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE uName=? AND passW=?", [username, password], (err,result)=>{
        if(err) {
            console.log(err)
        }
        res.send({
            token: result[0]?.uName
        })
        });
    });

app.post('/api/create', (req,res)=> {

    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);
    console.log(username,password)

    db.query("INSERT INTO users (uName, passW) VALUES (?,?)",[username, password], (err,result)=>{
        if(err) {
            console.log(err)
        }
        console.log(result)
    });   
})

app.get("/", (req,res)=>{
    db.query("CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, uName varchar(255) NOT NULL, passW varchar(255) NOT NULL);", (err,result)=>{
        if(err) {
            console.log(err)
        } 
        res.send(result)
        });
    });
    

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})