
// Unit tests for: handlBookingcancellation


import { BookingDetails } from "../../models/booking.model.js";
import { HotelDetails } from "../../models/hotel.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { handlBookingcancellation } from '../bookings.controller';


jest.mock("../../models/booking.model.js");
jest.mock("../../models/hotel.model.js");
jest.mock("../../models/user.model.js");

describe('handlBookingcancellation() handlBookingcancellation method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: { bookingId: 'mockBookingId' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('Happy Paths', () => {
        it('should successfully cancel a booking and update hotel and user records', async () => {
            // Mock booking details
            const mockBooking = {
                _id: 'mockBookingId',
                hotelId: 'mockHotelId',
                userId: 'mockUserId',
                checkInDate: new Date(Date.now() + 86400000), // 1 day in the future
                roomCount: 2
            };
            BookingDetails.findById.mockResolvedValue(mockBooking);

            // Mock hotel details
            const mockHotel = {
                availableRooms: 5,
                bookings: ['mockBookingId'],
                save: jest.fn()
            };
            HotelDetails.findById.mockResolvedValue(mockHotel);

            // Mock user details
            const mockUser = {
                bookingHistory: ['mockBookingId'],
                save: jest.fn()
            };
            User.findById.mockResolvedValue(mockUser);

            // Execute the function
            await handlBookingcancellation(req, res, next);

            // Assertions
            expect(BookingDetails.findById).toHaveBeenCalledWith('mockBookingId');
            expect(HotelDetails.findById).toHaveBeenCalledWith('mockHotelId');
            expect(User.findById).toHaveBeenCalledWith('mockUserId');
            expect(mockHotel.availableRooms).toBe(7);
            expect(mockHotel.save).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalled();
            expect(BookingDetails.findByIdAndDelete).toHaveBeenCalledWith('mockBookingId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, null, "Booking successfully canceled and rooms updated"));
        });
    });

    describe('Edge Cases', () => {
        it('should throw an error if booking is not found', async () => {
            // Mock no booking found
            BookingDetails.findById.mockResolvedValue(null);

            // Execute the function
            await expect(handlBookingcancellation(req, res, next)).rejects.toThrow("Booking Not Found!");

            // Assertions
            expect(BookingDetails.findById).toHaveBeenCalledWith('mockBookingId');
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should throw an error if current date exceeds check-in date', async () => {
            // Mock booking with past check-in date
            const mockBooking = {
                checkInDate: new Date(Date.now() - 86400000) // 1 day in the past
            };
            BookingDetails.findById.mockResolvedValue(mockBooking);

            // Execute the function
            await expect(handlBookingcancellation(req, res, next)).rejects.toThrow("Cannot cancel after Check In");

            // Assertions
            expect(BookingDetails.findById).toHaveBeenCalledWith('mockBookingId');
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should throw an error if associated hotel is not found', async () => {
            // Mock booking details
            const mockBooking = {
                hotelId: 'mockHotelId',
                checkInDate: new Date(Date.now() + 86400000) // 1 day in the future
            };
            BookingDetails.findById.mockResolvedValue(mockBooking);

            // Mock no hotel found
            HotelDetails.findById.mockResolvedValue(null);

            // Execute the function
            await expect(handlBookingcancellation(req, res, next)).rejects.toThrow("Associated hotel not found");

            // Assertions
            expect(BookingDetails.findById).toHaveBeenCalledWith('mockBookingId');
            expect(HotelDetails.findById).toHaveBeenCalledWith('mockHotelId');
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});

// End of unit tests for: handlBookingcancellation
