
// Unit tests for: handleSearchRequest


import { BookingDetails } from "../../models/booking.model.js";
import { HotelDetails } from "../../models/hotel.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { handleSearchRequest } from '../hotels.controller';


// jest.mock("../path/to/models/hotel.model.js");
// jest.mock("../path/to/models/booking.model.js");

jest.mock("../../models/hotel.model.js", () => ({
    HotelDetails: {
        find: jest.fn(),
    },
}));

jest.mock("../../models/booking.model.js", () => ({
    BookingDetails: {
        aggregate: jest.fn(),
    },
}));


describe('handleSearchRequest() handleSearchRequest method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                city: '',
                checkInDate: '',
                checkOutDate: '',
                requiredRooms: 0
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('Happy Paths', () => {
        it('should return available hotels when all conditions are met', async () => {
            req.body = {
                city: 'New York',
                checkInDate: '2023-12-01',
                checkOutDate: '2023-12-10',
                requiredRooms: 2
            };

            const mockHotels = [
                { _id: '1', roomCount: 5, toObject: jest.fn().mockReturnValue({}) }
            ];
            const mockBookings = [
                { _id: '1', totalRoomsBooked: 2 }
            ];

            HotelDetails.find.mockResolvedValue(mockHotels);
            BookingDetails.aggregate.mockResolvedValue(mockBookings);

            await handleSearchRequest(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, expect.any(Array), "All hotels with required search condition is returned")
            );
        });
    });

    describe('Edge Cases', () => {
        it('should throw an error if city is not provided', async () => {
            req.body.city = '';

            await expect(handleSearchRequest(req, res, next)).rejects.toThrow("city/country/hotel name is required");
        });

        it('should throw an error if only checkInDate is provided', async () => {
            req.body = {
                city: 'New York',
                checkInDate: '2023-12-01',
                checkOutDate: '',
                requiredRooms: 2
            };

            await expect(handleSearchRequest(req, res, next)).rejects.toThrow("Both CheckInDate and checkOutDate is required");
        });

        it('should throw an error if only checkOutDate is provided', async () => {
            req.body = {
                city: 'New York',
                checkInDate: '',
                checkOutDate: '2023-12-10',
                requiredRooms: 2
            };

            await expect(handleSearchRequest(req, res, next)).rejects.toThrow("Both CheckInDate and checkOutDate is required");
        });

        it('should return hotels in the city if no dates are provided', async () => {
            req.body = {
                city: 'New York',
                checkInDate: '',
                checkOutDate: '',
                requiredRooms: 0
            };

            const mockHotels = [
                { _id: '1', roomCount: 5, toObject: jest.fn().mockReturnValue({}) }
            ];

            HotelDetails.find.mockResolvedValue(mockHotels);

            await handleSearchRequest(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, expect.any(Array), "All hotels with required search condition is returned")
            );
        });

        it('should handle no hotels found in the city', async () => {
            req.body = {
                city: 'Unknown City',
                checkInDate: '2023-12-01',
                checkOutDate: '2023-12-10',
                requiredRooms: 2
            };

            HotelDetails.find.mockResolvedValue([]);

            await handleSearchRequest(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, [], "All hotels with required search condition is returned")
            );
        });
    });
});

// End of unit tests for: handleSearchRequest
