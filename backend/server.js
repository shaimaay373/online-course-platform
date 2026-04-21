import app from './src/app.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config();  
// connect to Database
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL)
.then(()=>{
    console.log("MongoDB Connected");

}).catch((err)=>{
    console.log("mongoDB Connection error");
    console.log(err.message);
})

//initiate server
const port =process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`server is Running at http://localhost:${port}`)
})















