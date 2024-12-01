
// Unit tests for: hotelDetails


import { HotelDetails } from "../../models/hotel.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { hotelDetails } from '../manager.controller';


jest.mock("../../models/hotel.model.js");

describe('hotelDetails() hotelDetails method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should return hotel details successfully when a valid email is provided', async () => {
            // Arrange
            const mockHotel = { id: '1', name: 'Test Hotel', email: 'test@example.com' };
            req.body.email = 'test@example.com';
            HotelDetails.findOne.mockResolvedValue(mockHotel);

            // Act
            await hotelDetails(req, res);

            // Assert
            expect(HotelDetails.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, mockHotel, "Hotel details fetched successfully"));
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should throw an error when email is not provided', async () => {
            // Arrange
            req.body.email = undefined;

            // Act & Assert
            await expect(hotelDetails(req, res)).rejects.toThrow("Email is required");
        });

        it('should throw an error when hotel is not found', async () => {
            // Arrange
            req.body.email = 'nonexistent@example.com';
            HotelDetails.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(hotelDetails(req, res)).rejects.toThrow("Hotel not found");
        });
    });
});

// End of unit tests for: hotelDetails
