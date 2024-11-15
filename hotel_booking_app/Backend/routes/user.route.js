import express from 'express'
// import { login } from '../controllers/loginhandle';
// import { forgotPassword, resetPassword } from '../controllers/passwordResetController';
// import { googleSignIn } from '../controllers/googleAuthController';
// import authMiddleware from '../middlewares/authMiddleware';
// import { updateProfile } from '../controllers/updateProfile';
import { handlegetPreviousBookings } from '../controllers/user.controller.js';

const Router = express.Router();

// Router.post("/createlogin", login);
// Router.post("/forgot-password", forgotPassword);
// Router.post("/reset-password", resetPassword);
// Router.post("/google-signin", googleSignIn);
// Router.put('/update-profile', authMiddleware, updateProfile);

Router.post("/bookig-history", handlegetPreviousBookings);

export default Router