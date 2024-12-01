
// Unit tests for: editHotelDetails


import { HotelDetails } from "../../models/hotel.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { editHotelDetails } from '../manager.controller';


jest.mock("../../models/hotel.model.js");

describe('editHotelDetails() editHotelDetails method', () => {
    let req, res, mockHotel;

    beforeEach(() => {
        req = {
            body: {
                address: '123 Main St',
                description: 'A lovely hotel',
                roomCount: 10,
                pricePerNight: 100,
                contactNo: '1234567890',
                email: 'hotel@example.com',
                facilities: ['Pool', 'Gym']
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockHotel = {
            _id: 'hotelId123',
            email: 'hotel@example.com',
            save: jest.fn()
        };
    });

    describe('Happy Paths', () => {
        it('should update hotel details successfully', async () => {
            // Arrange
            HotelDetails.findOne.mockResolvedValue(mockHotel);
            HotelDetails.findByIdAndUpdate.mockResolvedValue({
                ...mockHotel,
                ...req.body
            });

            // Act
            await editHotelDetails(req, res);

            // Assert
            expect(HotelDetails.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(HotelDetails.findByIdAndUpdate).toHaveBeenCalledWith(
                mockHotel._id,
                {
                    address: req.body.address,
                    description: req.body.description,
                    roomCount: req.body.roomCount,
                    pricePerNight: req.body.pricePerNight,
                    contactNo: req.body.contactNo,
                    facilities: req.body.facilities
                },
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ApiResponse(200, { success: true, hotel: { ...mockHotel, ...req.body } }, "Hotel details updated successfully"));
        });
    });

    describe('Edge Cases', () => {
        it('should return error if hotel is not found', async () => {
            // Arrange
            HotelDetails.findOne.mockResolvedValue(null);

            // Act
            await expect(editHotelDetails(req, res)).rejects.toThrow("Hotel not found");

            // Assert
            expect(HotelDetails.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should return error if update fails', async () => {
            // Arrange
            HotelDetails.findOne.mockResolvedValue(mockHotel);
            HotelDetails.findByIdAndUpdate.mockResolvedValue(null);

            // Act
            await expect(editHotelDetails(req, res)).rejects.toThrow("Couldn't update hotel details");

            // Assert
            expect(HotelDetails.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(HotelDetails.findByIdAndUpdate).toHaveBeenCalledWith(
                mockHotel._id,
                {
                    address: req.body.address,
                    description: req.body.description,
                    roomCount: req.body.roomCount,
                    pricePerNight: req.body.pricePerNight,
                    contactNo: req.body.contactNo,
                    facilities: req.body.facilities
                },
                { new: true, runValidators: true }
            );
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});

// End of unit tests for: editHotelDetails
