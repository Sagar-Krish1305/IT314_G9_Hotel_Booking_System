const message = require("../modules/message");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists with this email
    const user = await message.findOne({ e_mail: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
