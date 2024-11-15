import { User } from '../models/user.model.js'; 

const newmessage = async (req, res) => {
    try {
      const { first_name, last_name, e_mail, mobile_number, password, confirm_password, user_type } = req.body;
  
      // Check if the email already exists
      const existingUser = await User.findOne({ e_mail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
  
      // Check if password and confirm_password match
      if (password !== confirm_password) {
        return res.status(400).json({
          success: false,
          message: "Password and confirm password do not match",
        });
      }
  
      // If no user exists, proceed to create a new entry
      const createmessage = await User.create({
        first_name,
        last_name,
        e_mail,
        mobile_number: mobile_number || "Not provided", // Use "Not provided" if mobile_number is not given
        password,
        // confirm_password,
        user_type,
      });
  
      res.status(200).json({
        success: true,
        data: createmessage,
        message: "Entry created successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        data: "Error detected!",
        message: err.message,
      });
    }
  };

export {newmessage}