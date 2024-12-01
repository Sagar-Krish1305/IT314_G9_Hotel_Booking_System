
// Unit tests for: checkBookingCredential


import { BookingDetails } from "../../models/booking.model.js";
import { HotelDetails } from "../../models/hotel.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { checkBookingCredential } from '../bookings.controller';


// jest.mock("../path/to/models/hotel.model.js");
// jest.mock("../path/to/models/booking.model.js");

jest.mock("../../models/hotel.model.js", () => ({
    HotelDetails: {
        findById: jest.fn()
    }
}));

jest.mock("../../models/booking.model.js", () => ({
    BookingDetails: {
        aggregate: jest.fn()
    }
}));

describe('checkBookingCredential() checkBookingCredential method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                checkInDate: '2023-12-01',
                checkOutDate: '2023-12-10',
                requiredRooms: 2
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
        it('should return available rooms when enough rooms are available', async () => {
            // Arrange
            const mockHotel = { _id: 'hotel123', roomCount: 10 };
            const mockBookings = [{ _id: 'booking1', totalRoomsBooked: 5 }];

            HotelDetails.findById.mockResolvedValue(mockHotel);
            BookingDetails.aggregate.mockResolvedValue(mockBookings);

            // Act
            await checkBookingCredential(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(400, mockHotel, "Rooms are available for booking during this time")
            );
        });

        it('should return not enough rooms when rooms are not available', async () => {
            // Arrange
            const mockHotel = { _id: 'hotel123', roomCount: 10 };
            const mockBookings = [{ _id: 'booking1', totalRoomsBooked: 9 }];

            HotelDetails.findById.mockResolvedValue(mockHotel);
            BookingDetails.aggregate.mockResolvedValue(mockBookings);

            // Act
            await checkBookingCredential(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(400, mockHotel, "Not enough rooms to book during this time")
            );
        });
    });

    describe('Edge Cases', () => {
        it('should throw an error if any required field is missing', async () => {
            // Arrange
            req.body.checkInDate = '';

            // Act & Assert
            await expect(checkBookingCredential(req, res, next)).rejects.toThrow(
                "Check-In-Date, Check-Out-Date and Number of Rooms must be provided"
            );
        });

        it('should throw an error if hotel is not found', async () => {
            // Arrange
            HotelDetails.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(checkBookingCredential(req, res, next)).rejects.toThrow(
                "Hotel doesn't found with this hotel ID"
            );
        });

        it('should handle no bookings gracefully', async () => {
            // Arrange
            const mockHotel = { _id: 'hotel123', roomCount: 10 };
            const mockBookings = [];

            HotelDetails.findById.mockResolvedValue(mockHotel);
            BookingDetails.aggregate.mockResolvedValue(mockBookings);

            // Act
            await checkBookingCredential(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                new ApiResponse(400, mockHotel, "Rooms are available for booking during this time")
            );
        });
    });
});

// End of unit tests for: checkBookingCredential
