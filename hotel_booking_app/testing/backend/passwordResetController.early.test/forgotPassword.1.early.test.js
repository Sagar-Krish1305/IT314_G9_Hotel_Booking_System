
// Unit tests for: forgotPassword


import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../../models/user.model.js';
import { forgotPassword } from '../passwordResetController';


jest.mock("nodemailer");
jest.mock("../../models/user.model.js");
jest.mock("jsonwebtoken");

describe('forgotPassword() forgotPassword method', () => {
  let req, res, user, sendMailMock;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = {
      _id: 'userId123',
      e_mail: 'test@example.com',
    };

    sendMailMock = jest.fn((mailOptions, callback) => callback(null));
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should send a password reset email if user is found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('resetToken123');

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ e_mail: req.body.email });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      expect(sendMailMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset email sent' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 404 if user is not found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ e_mail: req.body.email });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 400 if there is an error sending the email', async () => {
      // Arrange
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('resetToken123');
      sendMailMock.mockImplementation((mailOptions, callback) => callback(new Error('Email error')));

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(sendMailMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error sending email' });
    });

    it('should return 400 if there is a server error', async () => {
      // Arrange
      User.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});

// End of unit tests for: forgotPassword
