const User         = require("../models/user.model");
const bcrypt       = require("bcryptjs");
const jwt          = require("jsonwebtoken");
const ExpressError = require("../utils/expressError");

const JWT_SECRET  = process.env.JWT_SECRET || "evbharat_secret_key";
const JWT_EXPIRES = "7d";

const generateToken = (user) => jwt.sign(
  { id: user._id, email: user.email, role: user.role, status: user.status },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES }
);

// ── REGISTER ──
module.exports.register = async (req, res) => {
  const { name, email, password, phoneNumber, role } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) throw new ExpressError(400, "Email already registered.");

  const phoneExists = await User.findOne({ phoneNumber });
  if (phoneExists) throw new ExpressError(400, "Phone number already registered.");

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password:    hashedPassword,
    phoneNumber,
    role: role === "station_owner" ? "station_owner" : "user",
  });

  const token = generateToken(user);

  res.status(201).json({
    message: "Account created successfully.",
    token,
    user: {
      id:           user._id,
      name:         user.name,
      email:        user.email,
      phoneNumber:  user.phoneNumber,
      profileImage: user.profileImage,
      role:         user.role,
      status:       user.status,
    },
  });
};

// ── LOGIN ──
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ExpressError(401, "Invalid email or password.");

  if (user.status === "banned")    throw new ExpressError(403, "Your account has been banned.");
  if (user.status === "suspended") throw new ExpressError(403, "Your account is suspended.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ExpressError(401, "Invalid email or password.");

  const token = generateToken(user);

  res.status(200).json({
    message: "Login successful.",
    token,
    user: {
      id:           user._id,
      name:         user.name,
      email:        user.email,
      phoneNumber:  user.phoneNumber,
      profileImage: user.profileImage,
      role:         user.role,
      status:       user.status,
    },
  });
};

// ── GET ME ──
module.exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) throw new ExpressError(404, "User not found.");
  res.status(200).json({ user });
};
