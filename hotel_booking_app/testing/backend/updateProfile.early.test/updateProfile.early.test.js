
// Unit tests for: updateProfile


import { User } from '../../models/user.model.js';
import { updateProfile } from '../updateProfile';


jest.mock("../../models/user.model.js");

describe('updateProfile() updateProfile method', () => {
    let req, res, userId, userMock;

    beforeEach(() => {
        userId = '12345';
        req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                mobileNumber: '1234567890'
            },
            user: {
                userId: userId
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        userMock = {
            _id: userId,
            first_name: 'John',
            last_name: 'Doe',
            e_mail: 'john.doe@example.com',
            mobile_number: '1234567890',
            user_type: 'regular'
        };
    });

    // Happy path tests
    describe('Happy paths', () => {
        it('should update the user profile successfully', async () => {
            // Arrange
            User.findByIdAndUpdate.mockResolvedValue(userMock);

            // Act
            await updateProfile(req, res);

            // Assert
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                userId,
                {
                    first_name: 'John',
                    last_name: 'Doe',
                    e_mail: 'john.doe@example.com',
                    mobile_number: '1234567890'
                },
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Profile updated successfully",
                user: {
                    id: userMock._id,
                    firstName: userMock.first_name,
                    lastName: userMock.last_name,
                    email: userMock.e_mail,
                    mobileNumber: userMock.mobile_number,
                    userType: userMock.user_type
                }
            });
        });
    });

    // Edge case tests
    describe('Edge cases', () => {
        it('should return 404 if user is not found', async () => {
            // Arrange
            User.findByIdAndUpdate.mockResolvedValue(null);

            // Act
            await updateProfile(req, res);

            // Assert
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                userId,
                expect.any(Object),
                expect.any(Object)
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "User not found"
            });
        });

        it('should handle server errors gracefully', async () => {
            // Arrange
            User.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            // Act
            await updateProfile(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Server error"
            });
        });

        it('should handle missing fields in request body', async () => {
            // Arrange
            req.body = {}; // Empty body
            User.findByIdAndUpdate.mockResolvedValue(userMock);

            // Act
            await updateProfile(req, res);

            // Assert
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                userId,
                {
                    first_name: undefined,
                    last_name: undefined,
                    e_mail: undefined,
                    mobile_number: undefined
                },
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});

// End of unit tests for: updateProfile
