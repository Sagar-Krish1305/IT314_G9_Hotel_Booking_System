const mongoose = require("mongoose");

require("dotenv").config();

const dbconnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("dbconnection successfull!");
    }).catch((err)=>{
        console.log(err);
        process.exit(1);
    })
}

module.exports = dbconnect;