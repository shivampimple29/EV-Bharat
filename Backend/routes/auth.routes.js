const express   = require("express");
const router    = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

router.post("/register", wrapAsync(register));
router.post("/login",    wrapAsync(login));
router.get("/me",        protect, wrapAsync(getMe));

module.exports = router;
