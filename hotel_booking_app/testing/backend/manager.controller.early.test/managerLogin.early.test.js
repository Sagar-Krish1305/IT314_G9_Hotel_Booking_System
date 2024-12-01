
// Unit tests for: managerLogin


import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HotelDetails } from "../../models/hotel.model.js";
import { managerLogin } from '../manager.controller';


jest.mock("../../models/hotel.model.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe('managerLogin() managerLogin method', () => {
    let req, res, jsonMock, statusMock;

    beforeEach(() => {
        req = {
            body: {
                email: 'manager@example.com',
                password: 'password123'
            }
        };

        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));
        res = {
            status: statusMock
        };
    });

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should return a success response with a token when credentials are correct', async () => {
            // Arrange
            const mockHotel = { _id: 'hotelId', password: 'hashedPassword' };
            HotelDetails.findOne.mockResolvedValue(mockHotel);
            bcryptjs.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            // Act
            await managerLogin(req, res);

            // Assert
            expect(HotelDetails.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(bcryptjs.compare).toHaveBeenCalledWith(req.body.password, mockHotel.password);
            expect(jwt.sign).toHaveBeenCalledWith({ hotelId: mockHotel._id }, 'your-secret-key', { expiresIn: '7d' });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: "Login successful",
                token: 'mockToken',
                hotel: { id: mockHotel._id }
            });
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should return an error response when hotel is not found', async () => {
            // Arrange
            HotelDetails.findOne.mockResolvedValue(null);

            // Act
            await managerLogin(req, res);

            // Assert
            expect(HotelDetails.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: "Incorrect Credentials"
            });
        });

        it('should return an error response when password does not match', async () => {
            // Arrange
            const mockHotel = { _id: 'hotelId', password: 'hashedPassword' };
            HotelDetails.findOne.mockResolvedValue(mockHotel);
            bcryptjs.compare.mockResolvedValue(false);

            // Act
            await managerLogin(req, res);

            // Assert
            expect(bcryptjs.compare).toHaveBeenCalledWith(req.body.password, mockHotel.password);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: "Incorrect password"
            });
        });

        it('should return a server error response when an exception is thrown', async () => {
            // Arrange
            HotelDetails.findOne.mockRejectedValue(new Error('Database error'));

            // Act
            await managerLogin(req, res);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: "Server error! Please try again later."
            });
        });
    });
});

// End of unit tests for: managerLogin
