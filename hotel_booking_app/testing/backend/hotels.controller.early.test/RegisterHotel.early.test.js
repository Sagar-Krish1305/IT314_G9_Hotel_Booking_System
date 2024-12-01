
// Unit tests for: RegisterHotel


import { HotelDetails } from "../../models/hotel.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { RegisterHotel } from '../hotels.controller';


// jest.mock("../path/to/models/hotel.model.js");
// jest.mock("../path/to/utils/cloudinary.js");

jest.mock("../../models/hotel.model.js", () => ({
    HotelDetails: {
        findOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.mock("../../utils/cloudinary.js", () => ({
    uploadOnCloudinary: jest.fn(),
}));

describe('RegisterHotel() RegisterHotel method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                hotelName: 'Test Hotel',
                city: 'Test City',
                country: 'Test Country',
                address: '123 Test St',
                description: 'A nice place to stay',
                roomCount: 10,
                pricePerNight: 100,
                contactNo: '1234567890',
                email: 'test@example.com',
                type: 'Luxury',
                facilities: 'Pool,Gym',
                password: 'securepassword'
            },
            files: {
                images: [{ path: 'path/to/image1.jpg' }, { path: 'path/to/image2.jpg' }]
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });

    describe('Happy Paths', () => {
        it('should register a hotel successfully when all inputs are valid', async () => {
            // Mocking the database and cloudinary calls
            HotelDetails.findOne.mockResolvedValue(null);
            uploadOnCloudinary.mockResolvedValue({ url: 'http://cloudinary.com/image.jpg' });
            HotelDetails.create.mockResolvedValue({ _id: '12345' });
            HotelDetails.findById.mockResolvedValue({ _id: '12345', hotelName: 'Test Hotel' });

            await RegisterHotel(req, res, next);

            expect(HotelDetails.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(uploadOnCloudinary).toHaveBeenCalledTimes(2);
            expect(HotelDetails.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Hotel Registered Successfully',
                data: { _id: '12345', hotelName: 'Test Hotel' }
            });
        });
    });

    describe('Edge Cases', () => {
        it('should throw an error if any mandatory field is missing', async () => {
            req.body.hotelName = '';

            await expect(RegisterHotel(req, res, next)).rejects.toThrow('All mandatory field is required');
        });

        it('should return an error if the hotel already exists', async () => {
            HotelDetails.findOne.mockResolvedValue({ email: 'test@example.com' });

            await RegisterHotel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Hotel with this email already exist!!',
                data: { email: 'test@example.com' }
            });
        });

        it('should throw an error if image upload to cloudinary fails', async () => {
            HotelDetails.findOne.mockResolvedValue(null);
            uploadOnCloudinary.mockResolvedValue(null);

            await expect(RegisterHotel(req, res, next)).rejects.toThrow("Couldn't upload image on cloudinary");
        });

        it('should throw an error if hotel creation fails', async () => {
            HotelDetails.findOne.mockResolvedValue(null);
            uploadOnCloudinary.mockResolvedValue({ url: 'http://cloudinary.com/image.jpg' });
            HotelDetails.create.mockResolvedValue({ _id: '12345' });
            HotelDetails.findById.mockResolvedValue(null);

            await expect(RegisterHotel(req, res, next)).rejects.toThrow('something went wrong while registering the hotel');
        });
    });
});

// End of unit tests for: RegisterHotel
