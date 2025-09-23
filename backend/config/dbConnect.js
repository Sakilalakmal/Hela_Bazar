const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connectDB(){
    mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
    console.log("Connected to MongoDB successfully ....");
    
}).catch((error)=>{
    console.log("Error connecting to MongoDB:", error.message);
    
});
}

module.exports = connectDB;