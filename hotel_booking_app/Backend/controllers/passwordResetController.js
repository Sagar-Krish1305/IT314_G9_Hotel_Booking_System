// const crypto = require('crypto');
import nodemailer from 'nodemailer';
import { User } from '../models/user.model.js'; 
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
const JWT_SECRET = 'your-secret-key'; // Use the same secret as in login

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shyamdummy10@gmail.com',
    pass: 'bfzodqaskcnrgiyr'
  }
});

const forgotPassword = async (req, res) => {

  try {
    const { email } = req.body;
    const user = await User.findOne({ e_mail: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate a password reset token using JWT
    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Send password reset email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.e_mail,
      from: 'shyamdummy10@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset email sent' });
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
 
  try {
    const { token, newPassword } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    res.status(500).json({ User: 'Server error' });
  }
};

export {forgotPassword, resetPassword}