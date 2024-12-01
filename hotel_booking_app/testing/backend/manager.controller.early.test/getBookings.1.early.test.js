
// Unit tests for: getBookings


import { BookingDetails } from "../../models/booking.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getBookings } from '../manager.controller';


jest.mock("../../models/booking.model.js");
jest.mock("../../models/user.model.js");

describe('getBookings() getBookings method', () => {
    let req, res, hotelId;

    beforeEach(() => {
        hotelId = 'hotel123';
        req = {
            params: { hotelId }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should return booking details successfully when bookings exist', async () => {
            // Arrange
            const mockBookings = [
                { _id: 'booking1', userId: 'user1' },
                { _id: 'booking2', userId: 'user2' }
            ];
            const mockUsers = [
                { _id: 'user1', first_name: 'John', last_name: 'Doe', e_mail: 'john@example.com', mobile_number: '1234567890' },
                { _id: 'user2', first_name: 'Jane', last_name: 'Smith', e_mail: 'jane@example.com', mobile_number: '0987654321' }
            ];
            const mockBookingDetails = [
                { _id: 'booking1', checkInDate: '2023-10-01', checkOutDate: '2023-10-05', roomCount: 2, totalCost: 500 },
                { _id: 'booking2', checkInDate: '2023-11-01', checkOutDate: '2023-11-05', roomCount: 1, totalCost: 300 }
            ];

            BookingDetails.find.mockResolvedValue(mockBookings);
            User.findById.mockImplementation((id) => {
                return {
                    select: jest.fn().mockResolvedValue(mockUsers.find(user => user._id === id))
                };
            });
            BookingDetails.findById.mockImplementation((id) => {
                return {
                    select: jest.fn().mockResolvedValue(mockBookingDetails.find(booking => booking._id === id))
                };
            });

            // Act
            await getBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    contactNo: '1234567890',
                    checkInDate: '2023-10-01',
                    checkOutDate: '2023-10-05',
                    bookedRooms: 2,
                    totalCost: 500
                },
                {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    contactNo: '0987654321',
                    checkInDate: '2023-11-01',
                    checkOutDate: '2023-11-05',
                    bookedRooms: 1,
                    totalCost: 300
                }
            ], "Booking Details return successfully"));
        });
    });

    describe('Edge Cases', () => {
        it('should return an empty array when no bookings are found', async () => {
            // Arrange
            BookingDetails.find.mockResolvedValue([]);

            // Act
            await getBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [], "Booking Details return successfully"));
        });

        it('should handle errors gracefully when an exception is thrown', async () => {
            // Arrange
            BookingDetails.find.mockRejectedValue(new Error('Database error'));

            // Act
            await expect(getBookings(req, res)).rejects.toThrow('An error occurred while retrieving booking.');
        });

        it('should skip users and bookings that cannot be found', async () => {
            // Arrange
            const mockBookings = [
                { _id: 'booking1', userId: 'user1' },
                { _id: 'booking2', userId: 'user2' }
            ];
            const mockUsers = [
                { _id: 'user1', first_name: 'John', last_name: 'Doe', e_mail: 'john@example.com', mobile_number: '1234567890' }
            ];
            const mockBookingDetails = [
                { _id: 'booking1', checkInDate: '2023-10-01', checkOutDate: '2023-10-05', roomCount: 2, totalCost: 500 }
            ];

            BookingDetails.find.mockResolvedValue(mockBookings);
            User.findById.mockImplementation((id) => {
                return {
                    select: jest.fn().mockResolvedValue(mockUsers.find(user => user._id === id))
                };
            });
            BookingDetails.findById.mockImplementation((id) => {
                return {
                    select: jest.fn().mockResolvedValue(mockBookingDetails.find(booking => booking._id === id))
                };
            });

            // Act
            await getBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    contactNo: '1234567890',
                    checkInDate: '2023-10-01',
                    checkOutDate: '2023-10-05',
                    bookedRooms: 2,
                    totalCost: 500
                }
            ], "Booking Details return successfully"));
        });
    });
});

// End of unit tests for: getBookings
