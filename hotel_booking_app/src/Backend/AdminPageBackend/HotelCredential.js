import mongoose from 'mongoose';
import generateUniqueId from 'generate-unique-id';

// Connect to MongoDB only once, not every time a hotel is created
mongoose.connect('mongodb://localhost:27017/hotelDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define the hotel schema
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
});
hotelDetailsSchema.index({ location: '2dsphere' });
const Hotel = mongoose.model('hotelDetails', hotelDetailsSchema);

console.log("Schema is Made");

// Function to create a new hotel with provided details
function createHotel(name, xCoord, yCoord, address, phoneNumber, email, minPrice, maxPrice) {
    return {
        name,
        xCoord,
        yCoord,
        address,
        phoneNumber,
        email,
        minPrice,
        maxPrice,
        hotelID: generateUniqueId({
            length: 32,
            useLetters: true,
            useNumbers: true,
        }),
    };
}

// Function to display hotel details
function displayHotelDetails(hotel) {
    return `
        Hotel Name: ${hotel.name}
        Hotel ID: ${hotel.hotelID}
        Address: ${hotel.address}
        Phone Number: ${hotel.phoneNumber}
        Email: ${hotel.email}
        Coordinates: (${hotel.xCoord}, ${hotel.yCoord})
    `;
}

// Function to save hotel details to the database
async function saveHotelDetails(hotel) {
    try {
        const newHotel = new Hotel({
            name: hotel.name,
            location: {
                type: 'Point',
                coordinates: [hotel.xCoord, hotel.yCoord],
            },
            minPrice: hotel.minPrice,
            maxPrice: hotel.maxPrice,
            hotelID: hotel.hotelID,
            email: hotel.email,
            phoneNumber: hotel.phoneNumber,
            address: hotel.address,
        });
        await newHotel.save();
        console.log("Hotel saved successfully");
    } catch (error) {
        console.error('Error adding hotel:', error);
    }
}

// Example of using the functions
const hotel1 = createHotel(
    "Hotel Summer Inn",
    78.2312,
    40.12312,
    "Plot No. 1021, Sanjay Society, Srinagar, J&K - 204234",
    "128319824124",
    "well_you_can_wait@gmail.com",
    5000,
    4000
);

console.log(displayHotelDetails(hotel1));
saveHotelDetails(hotel1);
