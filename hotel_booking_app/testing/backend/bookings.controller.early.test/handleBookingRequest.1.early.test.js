
// Unit tests for: handleBookingRequest


import mongoose from 'mongoose';
import { BookingDetails } from "../../models/booking.model.js";
import { HotelDetails } from "../../models/hotel.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { handleBookingRequest } from '../bookings.controller';


jest.mock("../../models/hotel.model.js");
jest.mock("../../models/booking.model.js");
jest.mock("../../models/user.model.js");

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
            user: {
                userId: 'user123'
            },
            params: {
                hotelId: 'hotel123'
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
            // Mocking the hotel and booking creation
            HotelDetails.findById.mockResolvedValue({ _id: 'hotel123', bookings: [] });
            BookingDetails.create.mockResolvedValue({ _id: 'booking123' });
            User.findByIdAndUpdate.mockResolvedValue({});

            await handleBookingRequest(req, res, next);

            expect(HotelDetails.findById).toHaveBeenCalledWith('hotel123');
            expect(BookingDetails.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'user123',
                hotelId: 'hotel123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                roomCount: 2,
                checkInDate: '2023-12-01',
                checkOutDate: '2023-12-10',
                totalCost: 500
            }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
        });
    });

    describe('Edge Cases', () => {
        it('should throw an error if any mandatory field is missing', async () => {
            req.body.firstName = '';

            await expect(handleBookingRequest(req, res, next)).rejects.toThrow('All mandatory field is required');
        });

        it('should throw an error if the hotel is not found', async () => {
            HotelDetails.findById.mockResolvedValue(null);

            await expect(handleBookingRequest(req, res, next)).rejects.toThrow('Hotel not found');
        });

        it('should throw an error if booking creation fails', async () => {
            HotelDetails.findById.mockResolvedValue({ _id: 'hotel123', bookings: [] });
            BookingDetails.create.mockResolvedValue(null);

            await expect(handleBookingRequest(req, res, next)).rejects.toThrow('Something went wrong while confirming the booking');
        });

        it('should throw an error if user ID is invalid', async () => {
            mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

            await expect(handleBookingRequest(req, res, next)).rejects.toThrow('Invalid user ID');
        });
    });
});

// End of unit tests for: handleBookingRequest
