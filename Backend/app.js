require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 8000;

const bookingRoutes = require("./routes/booking.routes");
const stationRoutes = require("./routes/station.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");
const DB_URL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connection with DB is successful!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(DB_URL);
}

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://shivampimple29-evassistant.hf.space",
    "https://ev-bharat-mu.vercel.app/",
  ],
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use("/api/auth",     authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ error: message });
});

app.listen(port, () => {
  console.log("App listening at port 8000");
});
