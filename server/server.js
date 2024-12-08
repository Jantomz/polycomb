// importing dotenv and configuring to load environment variables
require("dotenv").config();

// importing mongoose ODM Object Data Manager that wraps MongoDB with methods we can use
const mongoose = require("mongoose");

// importing the routes
const authRoutes = require("./routes/authRoutes");
const competitionRoutes = require("./routes/competitionRoutes");
const userRoutes = require("./routes/userRoutes");
const formRoutes = require("./routes/formRoutes");
const fileRoutes = require("./routes/fileRoutes");
const postRoutes = require("./routes/postRoutes");
const wordlistRoutes = require("./routes/wordlistRoutes");
const audioRoutes = require("./routes/audioRoutes");
const toolRoutes = require("./routes/toolRoutes");

// importing express
const express = require("express");

// creates express app
const app = express();

const cors = require("cors");

const PORT = process.env.PORT || 3001; // setting the port from environment variable or default to 3001

// middleware to parse JSON bodies with a size limit of 50mb
app.use(express.json({ limit: "50mb" }));

// enabling CORS for cross-origin requests
app.use(
  cors()
  // {
  //   origin: ["mern-exercise-reference.vercel.app/"],
  //   methods: ["POST", "GET", "PATCH", "DELETE"],
  //   credentials: true
  // }
);

const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

let gfs; // variable to hold GridFS stream for file uploads
let gfsAudio; // variable to hold GridFS stream for audio uploads

app.use(methodOverride("_method")); // allows overriding HTTP methods using query parameters

// Middleware to attach gfs and gfsAudio to the request object
app.use((req, res, next) => {
  req.gfs = gfs;
  req.gfsAudio = gfsAudio;
  next();
});

// connecting all the routes to the app with a base path
app.use("/api/auth", authRoutes);
app.use("/api/competition", competitionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/form", formRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/post", postRoutes);
app.use("/api/wordlist", wordlistRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/tool", toolRoutes);

// connect to MongoDB using mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests only if connected to database
    app.listen(PORT, () => {
      console.log(`Connected to DB and listening on port ${process.env.PORT}`);
      // initializing GridFS stream for file uploads
      gfs = Grid(mongoose.connection.db, mongoose.mongo);
      gfs.collection("uploads"); // setting the collection name for file uploads
      // initializing GridFS stream for audio uploads
      gfsAudio = Grid(mongoose.connection.db, mongoose.mongo);
      gfsAudio.collection("audios"); // setting the collection name for audio uploads
    });
  })
  .catch((error) => {
    console.log(error); // log any connection errors
  });
