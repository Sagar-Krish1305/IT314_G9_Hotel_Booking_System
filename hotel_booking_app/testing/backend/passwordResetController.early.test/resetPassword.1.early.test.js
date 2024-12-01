
// Unit tests for: resetPassword


import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model.js';
import { resetPassword } from '../passwordResetController';


jest.mock("../../models/user.model.js");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe('resetPassword() resetPassword method', () => {
  let req, res, userMock;

  beforeEach(() => {
    req = {
      body: {
        token: 'valid-token',
        newPassword: 'newPassword123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    userMock = {
      _id: 'user-id',
      password: 'oldPasswordHash',
      save: jest.fn()
    };

    User.findById = jest.fn().mockResolvedValue(userMock);
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user-id' });
    bcryptjs.genSalt = jest.fn().mockResolvedValue('salt');
    bcryptjs.hash = jest.fn().mockResolvedValue('newPasswordHash');
  });

  describe('Happy Paths', () => {
    it('should reset the password successfully when provided with a valid token and new password', async () => {
      // Act
      await resetPassword(req, res);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'your-secret-key');
      expect(User.findById).toHaveBeenCalledWith('user-id');
      expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
      expect(bcryptjs.hash).toHaveBeenCalledWith('newPassword123', 'salt');
      expect(userMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password has been reset' });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if the token is invalid', async () => {
      // Arrange
      jwt.verify.mockImplementation(() => { throw new jwt.JsonWebTokenError('Invalid token'); });

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired reset token' });
    });

    it('should return an error if the user is not found', async () => {
      // Arrange
      User.findById.mockResolvedValue(null);

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired reset token' });
    });

    it('should handle server errors gracefully', async () => {
      // Arrange
      User.findById.mockImplementation(() => { throw new Error('Server error'); });

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ User: 'Server error' });
    });
  });
});

// End of unit tests for: resetPassword
