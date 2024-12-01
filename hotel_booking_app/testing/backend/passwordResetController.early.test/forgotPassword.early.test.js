
// Unit tests for: forgotPassword


import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../../models/user.model.js';
import { forgotPassword } from '../passwordResetController';



jest.mock("nodemailer");
jest.mock("../../models/user.model.js");
jest.mock("jsonwebtoken");

describe('forgotPassword() forgotPassword method', () => {
  let req, res, sendMailMock;

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

    sendMailMock = jest.fn((mailOptions, callback) => callback(null));
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  describe('Happy Paths', () => {
    it('should send a password reset email if user is found', async () => {
      // Arrange
      const user = { _id: '123', e_mail: 'test@example.com' };
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('resetToken');

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ e_mail: 'test@example.com' });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      expect(sendMailMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset email sent' });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if user is not found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ e_mail: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 if there is an error sending email', async () => {
      // Arrange
      const user = { _id: '123', e_mail: 'test@example.com' };
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('resetToken');
      sendMailMock.mockImplementation((mailOptions, callback) => callback(new Error('Email error')));

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(sendMailMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error sending email' });
    });

    it('should return 500 if there is a server error', async () => {
      // Arrange
      User.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});

// End of unit tests for: forgotPassword
