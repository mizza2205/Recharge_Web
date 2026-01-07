const express = require('express')
const app = express()

app.get('/',(req,res)=>{
    res.send("get server ")
});

app.get('/home',(req,res)=>{
    res.send("get home server")
});

app.get('/aboutus',(req,res)=>{
    res.send("get about server")
})
app.listen(5000,()=>{
    console.log("server is running on port 5000")
})