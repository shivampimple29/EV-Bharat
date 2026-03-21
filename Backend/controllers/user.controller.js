const User         = require("../models/user.model");
const ExpressError = require("../utils/expressError");

// ── GET ALL USERS (admin) ──
module.exports.getAllUsers = async (req, res) => {
  const { page = 1, search = "", role = "", status = "" } = req.query;

  const limit = 20;
  const skip  = (page - 1) * limit;
  const filter = {};

  if (search.trim()) {
    filter.$or = [
      { name:  { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role.trim())   filter.role   = role;
  if (status.trim()) filter.status = status;

  const [users, total] = await Promise.all([
    User.find(filter).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    page:    Number(page),
    totalPages: Math.ceil(total / limit),
    total,
    users,
  });
};

// ── GET USER BY ID (admin) ──
module.exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ExpressError(404, "User not found.");
  res.status(200).json({ success: true, user });
};

// ── DELETE USER (admin) ──
module.exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ExpressError(404, "User not found.");

  // Admin cannot delete themselves
  if (user._id.toString() === req.user.id) {
    throw new ExpressError(400, "You cannot delete your own account.");
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User deleted successfully." });
};

// ── UPDATE USER STATUS — suspend / ban / activate (admin) ──
module.exports.updateUserStatus = async (req, res) => {
  const { status } = req.body;

  if (!["active", "suspended", "banned"].includes(status)) {
    throw new ExpressError(400, "Invalid status value.");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ExpressError(404, "User not found.");

  if (user._id.toString() === req.user.id) {
    throw new ExpressError(400, "You cannot change your own status.");
  }

  user.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User status updated to ${status}.`,
    user: { id: user._id, name: user.name, email: user.email, status: user.status },
  });
};

// ── UPDATE USER ROLE (admin) ──
module.exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!["user", "station_owner", "admin"].includes(role)) {
    throw new ExpressError(400, "Invalid role value.");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ExpressError(404, "User not found.");

  if (user._id.toString() === req.user.id) {
    throw new ExpressError(400, "You cannot change your own role.");
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}.`,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};
