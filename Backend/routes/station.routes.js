const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const stationController = require("../controllers/station.controller");
const { protect, stationOwnerOnly } = require("../middleware/auth");

router.get("/",       wrapAsync(stationController.getAllStations)); 
router.get("/nearby", wrapAsync(stationController.getNearbyStations));
router.get("/map", wrapAsync(stationController.getAllStationsForMap));
router.get("/:id", wrapAsync(stationController.getStationById));    

// station owner or admin can create
router.post("/", protect, stationOwnerOnly, wrapAsync(stationController.createStation));

module.exports = router;
