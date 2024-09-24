const mongoose = require("mongoose");

const messageapp = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            maxlength: 50,  
        },
        last_name: {
            type: String,
            required: true,
            maxlength: 50,  
        },
        e_mail: {
            type: String,
            required: true,
            maxlength: 50,  
        },
        password : {
            type: String,
            required: true,
            maxlength: 50,  
        },
        confirm_password: {
            type: String,
            required: true,
            maxlength: 50, 
        }
    }
);

module.exports = mongoose.model("message", messageapp);