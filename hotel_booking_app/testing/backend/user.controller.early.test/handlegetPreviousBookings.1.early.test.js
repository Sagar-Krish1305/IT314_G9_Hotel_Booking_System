
// Unit tests for: handlegetPreviousBookings


import { BookingDetails } from "../../models/booking.model.js";
import { HotelDetails } from "../../models/hotel.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { handlegetPreviousBookings } from '../user.controller';


jest.mock("../../models/booking.model.js");
jest.mock("../../models/hotel.model.js");

describe('handlegetPreviousBookings() handlegetPreviousBookings method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { userId: 'validUserId' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy paths', () => {
        it('should return previous bookings successfully when bookings exist', async () => {
            // Arrange
            const mockBookings = [
                { hotelId: 'hotel1', checkInDate: '2023-01-01', checkOutDate: '2023-01-05', firstName: 'John', lastName: 'Doe', roomCount: 2, totalCost: 500, email: 'john@example.com' },
                { hotelId: 'hotel2', checkInDate: '2023-02-01', checkOutDate: '2023-02-05', firstName: 'Jane', lastName: 'Doe', roomCount: 1, totalCost: 300, email: 'jane@example.com' }
            ];
            const mockHotels = [
                { _id: 'hotel1', hotelName: 'Hotel One', pricePerNight: 100, images: ['url1'] },
                { _id: 'hotel2', hotelName: 'Hotel Two', pricePerNight: 150, images: ['url2'] }
            ];

            BookingDetails.find.mockResolvedValue(mockBookings);
            HotelDetails.find.mockResolvedValue(mockHotels);

            // Act
            await handlegetPreviousBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [
                {
                    hotelName: 'Hotel One',
                    checkInDate: '2023-01-01',
                    checkOutDate: '2023-01-05',
                    firstName: 'John',
                    lastName: 'Doe',
                    pricePerNight: 100,
                    roomsBooked: 2,
                    totalPayment: 500,
                    email: 'john@example.com',
                    hotelPhotoUrl: 'url1'
                },
                {
                    hotelName: 'Hotel Two',
                    checkInDate: '2023-02-01',
                    checkOutDate: '2023-02-05',
                    firstName: 'Jane',
                    lastName: 'Doe',
                    pricePerNight: 150,
                    roomsBooked: 1,
                    totalPayment: 300,
                    email: 'jane@example.com',
                    hotelPhotoUrl: 'url2'
                }
            ], "Previous bookings retrieved successfully."));
        });
    });

    describe('Edge cases', () => {
        it('should return 404 when no bookings are found', async () => {
            // Arrange
            BookingDetails.find.mockResolvedValue([]);

            // Act
            await handlegetPreviousBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(404, [], "No bookings found."));
        });

        it('should handle missing hotel data gracefully', async () => {
            // Arrange
            const mockBookings = [
                { hotelId: 'hotel1', checkInDate: '2023-01-01', checkOutDate: '2023-01-05', firstName: 'John', lastName: 'Doe', roomCount: 2, totalCost: 500, email: 'john@example.com' }
            ];
            const mockHotels = []; // No hotels found

            BookingDetails.find.mockResolvedValue(mockBookings);
            HotelDetails.find.mockResolvedValue(mockHotels);

            // Act
            await handlegetPreviousBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, [], "Previous bookings retrieved successfully."));
        });

        it('should return 500 when an error occurs', async () => {
            // Arrange
            BookingDetails.find.mockRejectedValue(new Error('Database error'));

            // Act
            await handlegetPreviousBookings(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(500, null, "An error occurred while retrieving booking history."));
        });
    });
});

// End of unit tests for: handlegetPreviousBookings
