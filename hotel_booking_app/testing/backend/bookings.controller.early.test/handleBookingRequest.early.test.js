
// Unit tests for: handleBookingRequest


import { BookingDetails } from "../../models/booking.model.js";
import { HotelDetails } from "../../models/hotel.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { handleBookingRequest } from '../bookings.controller';



// jest.mock("../path/to/models/hotel.model.js");
// jest.mock("../path/to/models/booking.model.js");
// jest.mock("../path/to/models/user.model.js");

describe('handleBookingRequest() handleBookingRequest method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                checkInDate: '2023-12-01',
                checkOutDate: '2023-12-10',
                phone: '1234567890',
                roomCount: 2,
                totalCost: 500
            },
            params: {
                hotelId: 'validHotelId'
            },
            user: {
                userId: 'validUserId'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });

    describe('Happy Paths', () => {
        it('should successfully create a booking when all inputs are valid', async () => {
            // Mocking the database calls
            HotelDetails.findById.mockResolvedValue({ _id: 'validHotelId', bookings: [] });
            BookingDetails.create.mockResolvedValue({ _id: 'newBookingId' });
            User.findByIdAndUpdate.mockResolvedValue({ _id: 'validUserId' });

            await handleBookingRequest(req, res, next);

            expect(HotelDetails.findById).toHaveBeenCalledWith('validHotelId');
            expect(BookingDetails.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'validUserId',
                hotelId: 'validHotelId',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                roomCount: 2,
                checkInDate: '2023-12-01',
                checkOutDate: '2023-12-10',
                totalCost: 500
            }));
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('validUserId', { $push: { bookingHistory: 'newBookingId' } }, { new: true });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(201, expect.any(Object), "Booking confirmed successfully"));
        });
    });

    describe('Edge Cases', () => {
        it('should throw an error if any mandatory field is missing', async () => {
            req.body.firstName = '';

            await expect(handleBookingRequest(req, res, next)).rejects.toThrow("All mandatory field is required");
        });

        it('should throw an error if the hotel is not found', async () => {
            HotelDetails.findById.mockResolvedValue(null);

            await expect(handleBookingRequest(req, res, next)).rejects.toThrow("Hotel not found");
        });

        it('should throw an error if the booking creation fails', async () => {
            HotelDetails.findById.mockResolvedValue({ _id: 'validHotelId', bookings: [] });
            BookingDetails.create.mockResolvedValue(null);

            await expect(handleBookingRequest(req, res, next)).rejects.toThrow("Something went wrong while confirming the booking");
        });

        it('should throw an error if the user ID is invalid', async () => {
            req.user.userId = 'invalidUserId';

            await expect(handleBookingRequest(req, res, next)).rejects.toThrow("Invalid user ID");
        });
    });
});

// End of unit tests for: handleBookingRequest
