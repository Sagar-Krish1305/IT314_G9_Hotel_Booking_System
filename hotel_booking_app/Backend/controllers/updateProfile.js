const message = require("../modules/message");

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber } = req.body;
    const userId = req.user.userId; // Assuming you have middleware to extract user ID from token

    // Find the user and update their profile
    const updatedUser = await message.findByIdAndUpdate(
      userId,
      {
        first_name: firstName,
        last_name: lastName,
        e_mail: email,
        mobile_number: mobileNumber
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.e_mail,
        mobileNumber: updatedUser.mobile_number,
        userType: updatedUser.user_type
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};