
// Unit tests for: newmessage


import { User } from '../../models/user.model.js';
import { newmessage } from '../registerhandle';


jest.mock("../../models/user.model.js"); // Mock the User model

describe('newmessage() newmessage method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                e_mail: 'john.doe@example.com',
                mobile_number: '1234567890',
                password: 'password123',
                confirm_password: 'password123',
                user_type: 'guest',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findOne.mockClear();
        User.create.mockClear();
    });

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should create a new user when all inputs are valid and email does not exist', async () => {
            // Arrange
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({ id: 1, ...req.body });

            // Act
            await newmessage(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ e_mail: req.body.e_mail });
            expect(User.create).toHaveBeenCalledWith({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                e_mail: req.body.e_mail,
                mobile_number: req.body.mobile_number,
                password: req.body.password,
                user_type: req.body.user_type,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { id: 1, ...req.body },
                message: 'Entry created successfully',
            });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should return an error if the email already exists', async () => {
            // Arrange
            User.findOne.mockResolvedValue({ id: 1, e_mail: req.body.e_mail });

            // Act
            await newmessage(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ e_mail: req.body.e_mail });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'User with this email already exists',
            });
        });

        it('should return an error if password and confirm_password do not match', async () => {
            // Arrange
            req.body.confirm_password = 'differentPassword';

            // Act
            await newmessage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Password and confirm password do not match',
            });
        });

        it('should handle missing mobile_number by setting it to "Not provided"', async () => {
            // Arrange
            req.body.mobile_number = undefined;
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({ id: 1, ...req.body, mobile_number: 'Not provided' });

            // Act
            await newmessage(req, res);

            // Assert
            expect(User.create).toHaveBeenCalledWith({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                e_mail: req.body.e_mail,
                mobile_number: 'Not provided',
                password: req.body.password,
                user_type: req.body.user_type,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { id: 1, ...req.body, mobile_number: 'Not provided' },
                message: 'Entry created successfully',
            });
        });

        it('should handle unexpected errors gracefully', async () => {
            // Arrange
            const errorMessage = 'Unexpected error';
            User.findOne.mockRejectedValue(new Error(errorMessage));

            // Act
            await newmessage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                data: 'Error detected!',
                message: errorMessage,
            });
        });
    });
});

// End of unit tests for: newmessage
