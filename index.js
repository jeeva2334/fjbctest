const express = require('express');
const app = express();
const { register, login } = require('./Controllers/UserLogin.controller');

app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jeevadev910:jeeva@cluster0.fbz4an6.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});

app.get('/',(req,res)=>{
    res.send("hello world");
})

app.post('/user/register', register);
app.post('/user/login', login);

app.listen(3000,()=>{
    console.log("App is listening at port 3000");
});