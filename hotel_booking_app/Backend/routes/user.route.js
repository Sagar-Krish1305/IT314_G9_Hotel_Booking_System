import express from 'express'
import { login } from '../controllers/loginhandle';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController';
// import { googleSignIn } from '../controllers/googleAuthController';
// import authMiddleware from '../middlewares/authMiddleware';
// import { updateProfile } from '../controllers/updateProfile';
import { handlegetPreviousBookings } from '../controllers/user.controller.js';

const Router = express.Router();

Router.post(
    "/createlogin", [
        
        //validation rules 
        body("email")
            .isEmail()
            .withMessage("A valid email is required."),
        
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long.")
            .matches(/[A-Z]/)
            .withMessage("Password must contain at least one uppercase letter.")
            .matches(/[a-z]/)
            .withMessage("Password must contain at least one lowercase letter.")
            .matches(/\d/)
            .withMessage("Password must contain at least one number.")
            .matches(/[@$!%*?&]/)
            .withMessage("Password must contain at least one special character (@, $, !, %, *, ?, &)."),
        
    ], login);
    

Router.post("/forgot-password", [
        //validation rules 

        body("email")
            .isEmail()
            .withMessage("A valid email is required."),
    ], forgotPassword);


Router.post("/reset-password", [

        //validation rules 
        body("token")
            .notEmpty()
            .withMessage("Reset token is required."),
    
        body("newPassword")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long.")
            .matches(/[A-Z]/)
            .withMessage("Password must contain at least one uppercase letter.")
            .matches(/[a-z]/)
            .withMessage("Password must contain at least one lowercase letter.")
            .matches(/\d/)
            .withMessage("Password must contain at least one number.")
            .matches(/[@$!%*?&]/)
            .withMessage("Password must contain at least one special character (@, $, !, %, *, ?, &).")
        
    ], resetPassword);
    

// Router.post("/google-signin", googleSignIn);
// Router.put('/update-profile', authMiddleware, updateProfile);

Router.get("/bookig-history", handlegetPreviousBookings);

export default Router