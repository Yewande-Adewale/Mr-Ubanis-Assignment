require('dotenv').config();
const mongoose = require("mongoose");

const db = process.env.DB_DATABASE
mongoose.connect(db)
.then(()=>{
    console.log("connection to the database is successful")
}).catch((error)=>{
        console.log(error.message)
    })