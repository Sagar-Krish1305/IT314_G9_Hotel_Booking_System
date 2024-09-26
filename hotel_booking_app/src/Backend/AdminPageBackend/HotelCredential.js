import mongoose from 'mongoose';
import generateUniqueId from 'generate-unique-id';

export class HotelCredential{
    constructor(name, xCoord, yCoord, address, phoneNumber, email, minPrice, maxPrice) {
        this.name = name;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.hotelID = generateUniqueId({
            length: 32,
            useLetters: true,
            useNumbers: true,
        });
    }

    // Method to display hotel details
    displayDetails() {
        return `
            Hotel Name: ${this.name}
            Hotel ID: ${this.hotelID}
            Address: ${this.address}
            Phone Number: ${this.phoneNumber}
            Email: ${this.email}
            Coordinates: (${this.xCoord}, ${this.yCoord})
        `;
    }

    async saveDetails(){

        try {
            const newHotel = new Hotel({
                name: this.name,
                location: {
                    type: 'Point',
                    coordinates: [this.xCoord, this.yCoord],
                },
                minPrice: this.minPrice,
                maxPrice: this.maxPrice,
                hotelID: this.hotelID,
                email: this.email,
                phoneNumber: this.phoneNumber,
                address: this.address,
            });
            await newHotel.save();
        } catch (error) {
            console.error('Error adding hotel:', error);
        }
    }
}

mongoose.connect('mongodb://localhost:27017/hotelDB') // DO NOT CONNECT EVERY TIME
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err));

        
const hotelDetailsSchema = new mongoose.Schema({
    name: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
    },
    maxPrice: Number,
    minPrice: Number,
    rating: Number,
    hotelID: String,
    email: String,
    phoneNumber: String,
    address: String,
})

hotelDetailsSchema.index({ location: '2dsphere' })

const Hotel = new mongoose.model('hotelDetails', hotelDetailsSchema)
console.log("Schema is Made")

const hotel1 = new HotelCredential(
    "Hotel Summer Inn",
    78.2312,
    40.12312,
    "Plot No. 1021, Sanjay Society, Srinagar, J&K - 204234",
    "128319824124",
    "well_you_can_wait@gmail.com",
    5000,
    4000
)
hotel1.saveDetails();