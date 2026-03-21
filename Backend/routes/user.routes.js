const express    = require("express");
const router     = express.Router();
const wrapAsync  = require("../utils/wrapAsync");
const { protect, adminOnly } = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserStatus,
  updateUserRole,
} = require("../controllers/user.controller");

// admin routes
router.get("/",                protect, adminOnly, wrapAsync(getAllUsers));
router.get("/:id",             protect, adminOnly, wrapAsync(getUserById));
router.delete("/:id",          protect, adminOnly, wrapAsync(deleteUser));
router.patch("/:id/status",    protect, adminOnly, wrapAsync(updateUserStatus));
router.patch("/:id/role",      protect, adminOnly, wrapAsync(updateUserRole));

module.exports = router;
