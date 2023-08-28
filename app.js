import bodyParser from 'body-parser';
import express from 'express';
import cors from "cors";

import UserRoute from './routes/user.route.js'
import mongoose from 'mongoose';
const app = express();

mongoose.connect("mongodb+srv://ujjwalparsai109:ujjwal6660@cluster0.0shrke3.mongodb.net/?retryWrites=true&w=majority")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());

app.use('/user',UserRoute);


app.listen(3000,()=>{
    console.log("server start");
    
})
