import { BookingDetails } from "../../models/booking.model.js";
import { HotelDetails } from "../../models/hotel.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { handlegetPreviousBookings } from '../user.controller';

jest.mock("../../models/booking.model.js");
jest.mock("../../models/hotel.model.js");

describe('handlegetPreviousBookings() method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { userId: 'validUserId' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should return previous bookings successfully', async () => {
            // Create a complete mock booking object
            const mockBooking = {
                _id: 'bookingId1',
                hotelId: 'hotelId1',
                checkInDate: '2023-10-01',
                checkOutDate: '2023-10-05',
                firstName: 'John',
                lastName: 'Doe',
                roomCount: 2,
                totalCost: 500,
                email: 'john@example.com'
            };

            // Create a complete mock hotel object
            const mockHotel = {
                _id: 'hotelId1',
                hotelName: 'Hotel California',
                pricePerNight: 100,
                images: ['url1']
            };

            // Mock the initial find query to return an array of bookings
            BookingDetails.find.mockResolvedValue([mockBooking]);

            // Mock findById to return the specific booking when queried
            BookingDetails.findById.mockImplementation((id) => {
                // Return the mock booking if ID matches
                if (id === 'bookingId1') {
                    return Promise.resolve(mockBooking);
                }
                return Promise.resolve(null);
            });

            // Mock hotel findById
            HotelDetails.findById.mockImplementation((id) => {
                // Return the mock hotel if ID matches
                if (id === 'hotelId1') {
                    return Promise.resolve(mockHotel);
                }
                return Promise.resolve(null);
            });

            // Execute the controller function
            await handlegetPreviousBookings(req, res);

            // Verify the response
            // expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, [{
                    hotelName: 'Hotel California',
                    checkInDate: '2023-10-01',
                    checkOutDate: '2023-10-05',
                    firstName: 'John',
                    lastName: 'Doe',
                    pricePerNight: 100,
                    roomsBooked: 2,
                    totalPayment: 500,
                    email: 'john@example.com',
                    hotelPhotoUrl: 'url1'
                }], "Previous Booking Details return successfully")
            );

            // Verify that all expected database calls were made
            expect(BookingDetails.find).toHaveBeenCalledWith({ userId: 'validUserId' });
            expect(BookingDetails.findById).toHaveBeenCalledWith('bookingId1');
            expect(HotelDetails.findById).toHaveBeenCalledWith('hotelId1');
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should handle no previous bookings', async () => {
            // Arrange
            BookingDetails.find.mockResolvedValue([]);

            // Act
            await handlegetPreviousBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, [], "Previous Booking Details return successfully")
            );
        });

        it('should handle invalid hotel ID gracefully', async () => {
            // Arrange
            const mockBookings = [
                {
                    _id: 'bookingId1',
                    hotelId: 'invalidHotelId',
                    checkInDate: '2023-10-01',
                    checkOutDate: '2023-10-05',
                    firstName: 'John',
                    lastName: 'Doe',
                    roomCount: 2,
                    totalCost: 500,
                    email: 'john@example.com'
                }
            ];

            BookingDetails.find.mockResolvedValue(mockBookings);
            BookingDetails.findById.mockResolvedValue(mockBookings);
            HotelDetails.findById.mockResolvedValue(null);

            // Act
            await handlegetPreviousBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(200, [], "Previous Booking Details return successfully")
            );
        });

        it('should handle errors during booking retrieval', async () => {
            // Arrange
            const error = new Error('Database error');
            BookingDetails.find.mockRejectedValue(error);

            // Act & Assert
            await expect(handlegetPreviousBookings(req, res))
                .rejects
                .toThrow('An error occurred while retrieving booking history.');
        });
    });
});