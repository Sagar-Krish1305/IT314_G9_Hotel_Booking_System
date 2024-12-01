
// Unit tests for: getDetailsOfHotel


import { HotelDetails } from "../../models/hotel.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getDetailsOfHotel } from '../hotels.controller';


// jest.mock("../path/to/models/hotel.model.js");
jest.mock("../../models/hotel.model.js", () => ({
    HotelDetails: {
        findById: jest.fn(),
    },
}));

describe('getDetailsOfHotel() getDetailsOfHotel method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                hotelId: '12345'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should return hotel details with ratings when hotel exists', async () => {
            // Mocking HotelDetails.findById to return a hotel with ratings
            HotelDetails.findById.mockResolvedValueOnce({
                _id: '12345',
                hotelName: 'Test Hotel',
                ratings: [
                    {
                        overallRating: 4,
                        serviceRating: 5,
                        roomsRating: 4,
                        cleanlinessRating: 4,
                        foodRating: 3,
                        userId: { first_name: 'John', last_name: 'Doe' }
                    }
                ],
                toObject: jest.fn().mockReturnThis()
            });

            await getDetailsOfHotel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, expect.any(Object), "Hotel ratings retrieved successfully")
            );
        });

        it('should return hotel details with no ratings when hotel exists but has no ratings', async () => {
            // Mocking HotelDetails.findById to return a hotel with no ratings
            HotelDetails.findById.mockResolvedValueOnce({
                _id: '12345',
                hotelName: 'Test Hotel',
                ratings: [],
                toObject: jest.fn().mockReturnThis()
            });

            await getDetailsOfHotel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, expect.any(Object), "Hotel ratings retrieved successfully")
            );
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should throw an error when hotel is not found', async () => {
            // Mocking HotelDetails.findById to return null
            HotelDetails.findById.mockResolvedValueOnce(null);

            await expect(getDetailsOfHotel(req, res, next)).rejects.toThrow("Hotel not found");
        });

        it('should return hotel details with ratings and calculate average ratings correctly when hotel exists', async () => {
            // Mocking HotelDetails.findById to return a hotel with ratings
            HotelDetails.findById.mockResolvedValueOnce({
                _id: '12345',
                hotelName: 'Test Hotel',
                ratings: [
                    {
                        overallRating: 4,
                        serviceRating: 5,
                        roomsRating: 4,
                        cleanlinessRating: 4,
                        foodRating: 3,
                        userId: { first_name: 'John', last_name: 'Doe' }
                    },
                    {
                        overallRating: 3,
                        serviceRating: 4,
                        roomsRating: 3,
                        cleanlinessRating: 5,
                        foodRating: 4,
                        userId: { first_name: 'Jane', last_name: 'Smith' }
                    }
                ],
                toObject: jest.fn().mockReturnThis()
            });
        
            await getDetailsOfHotel(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, expect.objectContaining({
                    _id: '12345',
                    hotelName: 'Test Hotel',
                    averageOverallRating: 3.5,
                    averageServiceRating: 4.5,
                    averageRoomsRating: 3.5,
                    averageCleanlinessRating: 4.5,
                    averageFoodRating: 3.5
                }), "Hotel ratings retrieved successfully")
            );
        });

        it('should handle hotel with ratings but no user information', async () => {
            // Mocking HotelDetails.findById to return a hotel with ratings but no user info
            HotelDetails.findById.mockResolvedValueOnce({
                _id: '12345',
                hotelName: 'Test Hotel',
                ratings: [
                    {
                        overallRating: 4,
                        serviceRating: 5,
                        roomsRating: 4,
                        cleanlinessRating: 4,
                        foodRating: 3,
                        userId: null
                    }
                ],
                toObject: jest.fn().mockReturnThis()
            });

            await getDetailsOfHotel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, expect.any(Object), "Hotel ratings retrieved successfully")
            );
        });

        it('should handle invalid hotelId format gracefully', async () => {
            req.params.hotelId = 'invalid-id';

            // Mocking HotelDetails.findById to throw an error for invalid ID
            HotelDetails.findById.mockImplementationOnce(() => {
                throw new Error("Invalid ID format");
            });

            await expect(getDetailsOfHotel(req, res, next)).rejects.toThrow("Invalid ID format");
        });
    });
});

// End of unit tests for: getDetailsOfHotel
