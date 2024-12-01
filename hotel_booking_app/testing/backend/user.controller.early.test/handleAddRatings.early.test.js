
// Unit tests for: handleAddRatings


import mongoose from "mongoose";
import { HotelDetails } from "../../models/hotel.model.js";
import { Rating } from "../../models/rating.model.js";
import { User } from "../../models/user.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { handleAddRatings } from '../user.controller';


jest.mock("../../models/rating.model.js");
jest.mock("../../models/user.model.js");
jest.mock("../../models/hotel.model.js");
jest.mock("../../utils/cloudinary.js");


describe('handleAddRatings() handleAddRatings method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                rating: 5,
                title: 'Great stay!',
                details: 'The hotel was wonderful.',
                service: 5,
                rooms: 5,
                cleanliness: 5,
                food: 5
            },
            params: {
                hotelId: new mongoose.Types.ObjectId().toString()
            },
            user: {
                userId: new mongoose.Types.ObjectId().toString()
            },
            files: []
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });

    // Happy Path Tests
    it('should add a rating successfully when all inputs are valid', async () => {
        // Mocking database calls
        User.find.mockResolvedValue([{}]);
        HotelDetails.findById.mockResolvedValue({ ratings: [], save: jest.fn() });
        Rating.create.mockResolvedValue({ _id: new mongoose.Types.ObjectId() });

        await handleAddRatings(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 201,
            message: 'Rating added successfully.'
        }));
    });

    // Edge Case Tests
    it('should throw an error when user is not found', async () => {
        // Arrange
        User.find.mockResolvedValue(null); // Simulate no user found

        // Act & Assert
        await expect(handleAddRatings(req, res, next)).rejects.toThrow("User not found.");

        // Ensure no response is sent
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw an error if any required field is missing', async () => {
        req.body.rating = undefined;

        await expect(handleAddRatings(req, res, next)).rejects.toThrow('All fields are required.');
    });

    it('should throw an error if userId is invalid', async () => {
        req.user.userId = 'invalidUserId';

        await expect(handleAddRatings(req, res, next)).rejects.toThrow('Invalid user ID.');
    });

    it('should throw an error if hotelId is invalid', async () => {
        req.params.hotelId = 'invalidHotelId';

        await expect(handleAddRatings(req, res, next)).rejects.toThrow('Invalid hotel ID.');
    });

    it('should throw an error if hotel is not found', async () => {
        User.find.mockResolvedValue([{}]);
        HotelDetails.findById.mockResolvedValue(null);

        await expect(handleAddRatings(req, res, next)).rejects.toThrow('Hotel not found.');
    });

    it('should handle image uploads correctly', async () => {
        req.files = [{ path: 'path/to/image.jpg' }];
        uploadOnCloudinary.mockResolvedValue({ secure_url: 'http://cloudinary.com/image.jpg' });

        User.find.mockResolvedValue([{}]);
        HotelDetails.findById.mockResolvedValue({ ratings: [], save: jest.fn() });
        Rating.create.mockResolvedValue({ _id: new mongoose.Types.ObjectId() });

        await handleAddRatings(req, res, next);

        expect(uploadOnCloudinary).toHaveBeenCalledWith('path/to/image.jpg');
    });

    it('should throw an error if there is an internal server error', async () => {
        User.find.mockResolvedValue([{}]);
        HotelDetails.findById.mockResolvedValue({ ratings: [], save: jest.fn() });
        Rating.create.mockRejectedValue(new Error('Database error'));

        await expect(handleAddRatings(req, res, next)).rejects.toThrow('Database error');
    });
});

// End of unit tests for: handleAddRatings
