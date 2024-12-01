
// Unit tests for: resetPassword


import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model.js';
import { resetPassword } from '../passwordResetController';


jest.mock("../../models/user.model.js");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe('resetPassword() resetPassword method', () => {
  let req, res, user, token, newPassword;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      body: {
        token: 'valid-token',
        newPassword: 'newSecurePassword123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock user data
    user = {
      _id: 'user-id',
      password: 'oldPasswordHash',
      save: jest.fn()
    };

    // Mock token and password
    token = 'valid-token';
    newPassword = 'newSecurePassword123';
  });

  describe('Happy Paths', () => {
    it('should reset the password successfully when provided with a valid token and new password', async () => {
      // Arrange
      jwt.verify.mockReturnValue({ userId: user._id });
      User.findById.mockResolvedValue(user);
      bcryptjs.genSalt.mockResolvedValue('salt');
      bcryptjs.hash.mockResolvedValue('hashedNewPassword');

      // Act
      await resetPassword(req, res);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, 'your-secret-key');
      expect(User.findById).toHaveBeenCalledWith(user._id);
      expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
      expect(bcryptjs.hash).toHaveBeenCalledWith(newPassword, 'salt');
      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password has been reset' });
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 if the token is invalid or expired', async () => {
      // Arrange
      jwt.verify.mockImplementation(() => { throw new jwt.JsonWebTokenError('Invalid token'); });

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired reset token' });
    });

    it('should return 400 if the user is not found', async () => {
      // Arrange
      jwt.verify.mockReturnValue({ userId: user._id });
      User.findById.mockResolvedValue(null);

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired reset token' });
    });

    it('should return 500 if there is a server error', async () => {
      // Arrange
      jwt.verify.mockReturnValue({ userId: user._id });
      User.findById.mockRejectedValue(new Error('Server error'));

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ User: 'Server error' });
    });
  });
});

// End of unit tests for: resetPassword
