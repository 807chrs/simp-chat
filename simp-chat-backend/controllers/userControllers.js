const User = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require("../cloudinary");

module.exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, userName, email, password, profileImage } =
      req.body;

    if (profileImage) {
      const uploadRes = await cloudinary.uploader.upload(profileImage, {
        upload_preset: "simp-chat-profiles",
      });
      const userNameDbCheck = await User.findOne({ userName });
      if (userNameDbCheck) {
        return res.json({
          message: "Username already exist.",
          status: false,
        });
      }
      const emailDbCheck = await User.findOne({ email });
      if (emailDbCheck) {
        return res.json({
          message: "Email already exist.",
          status: false,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      if (uploadRes) {
        const user = await User.create({
          firstName,
          lastName,
          userName,
          email,
          password: hashedPassword,
          profileImage: uploadRes,
        });
        delete user.password;
        return res.json({ status: true, user });
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.json({
        message: "Incorrect Username or Password.",
        status: false,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        message: "Incorrect Username or Password.",
        status: false,
      });
    }
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "firstName",
      "lastName",
      "userName",
      "profileImage",
      "_id",
    ]);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};
