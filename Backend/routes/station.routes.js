const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const stationController = require("../controllers/station.controller");

router.get("/nearby", wrapAsync(stationController.getNearbyStations));
router.get("/map", wrapAsync(stationController.getAllStationsForMap));
router.get("/:id", wrapAsync(stationController.getStationById));    


module.exports = router;
