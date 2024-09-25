const express = require("express");
const app = express();

require("dotenv").config();

const port = process.env.DATABASE_URL || 4000;

app.use(express.json());

const messagerouter = require("./routers/message_route");
app.use("/api/v1",messagerouter);

const dbconnect = require("./config/database");
dbconnect();

app.listen(3000,()=>{
    console.log("App is running on port no. 3000");
})

app.get('/',(req,res)=>{
    res.send("I am starting my software engineeriing project.")
})