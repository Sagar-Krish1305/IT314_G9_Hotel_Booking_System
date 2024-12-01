
// Unit tests for: login


import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model.js';
import { login } from '../loginhandle';


jest.mock("../../models/user.model.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe('login() login method', () => {
  let req, res, user;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = {
      _id: 'userId123',
      e_mail: 'test@example.com',
      password: 'hashedPassword',
      user_type: 'customer',
      mobile_number: '1234567890',
      first_name: 'John',
      last_name: 'Doe',
    };
  });

  describe('Happy Paths', () => {
    it('should successfully login a user with correct credentials', async () => {
      // Mocking User.findOne to return a user
      User.findOne.mockResolvedValue(user);

      // Mocking bcryptjs.compare to return true
      bcryptjs.compare.mockResolvedValue(true);

      // Mocking jwt.sign to return a token
      jwt.sign.mockReturnValue('mockToken');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ e_mail: req.body.email });
      expect(bcryptjs.compare).toHaveBeenCalledWith(req.body.password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: user._id,
          email: user.e_mail,
          userType: user.user_type,
          mobileNumber: user.mobile_number,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        'your-secret-key',
        { expiresIn: '7d' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        token: 'mockToken',
        user: {
          id: user._id,
          firstName: user.first_name,
          lastName: user.last_name,
          mobileNumber: user.mobile_number,
          userType: user.user_type,
          email: user.e_mail,
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if the user is not registered', async () => {
      // Mocking User.findOne to return null
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ e_mail: req.body.email });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not registered',
      });
    });

    it('should return an error if the password is incorrect', async () => {
      // Mocking User.findOne to return a user
      User.findOne.mockResolvedValue(user);

      // Mocking bcryptjs.compare to return false
      bcryptjs.compare.mockResolvedValue(false);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ e_mail: req.body.email });
      expect(bcryptjs.compare).toHaveBeenCalledWith(req.body.password, user.password);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Incorrect password',
      });
    });

    it('should handle server errors gracefully', async () => {
      // Mocking User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error',
      });
    });
  });
});

// End of unit tests for: login
