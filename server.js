
import connectDB from "./app/config/database.js";
import dotenv from 'dotenv';
import app from './app.js'
const port = 3333;

dotenv.config()

await connectDB();


app.listen(port,()=>{
    console.log(`Server start on port ${port}`)
})