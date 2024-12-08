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

const PORT = process.env.PORT || 3001;

// creating middleware, any code that runs between an HTTP request and our response
// the 'next' parameter is a function that will allow the middleware to move on to the next piece of middleware
// this middleware will always run first before the app.get request handler

// this middleware uses a middleware built into express, checking if the request has a body, if so, it will parse and attach it to the request object
app.use(express.json({ limit: "50mb" }));

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

let gfs;
let gfsAudio;

app.use(methodOverride("_method"));

// Middleware to attach gfs to the request object
app.use((req, res, next) => {
  req.gfs = gfs;
  req.gfsAudio = gfsAudio;
  next();
});

// routes, connects all the routes defined in the workouts file to the app
// has a pre route that means the routes will only fire once the pre route is fired
app.use("/api/auth", authRoutes);
app.use("/api/competition", competitionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/form", formRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/post", postRoutes);
app.use("/api/wordlist", wordlistRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/tool", toolRoutes);

// connect to db, it is await async and returns a promise, so we tack on a .then to tell the program what to do after it has completed the connection, catches errors too
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests only if connected to database
    // the function is called once the app is successfully listened on the port
    app.listen(PORT, () => {
      console.log(`Connected to DB and listening on port ${process.env.PORT}`);
      // connecting to the gridfs stream
      gfs = Grid(mongoose.connection.db, mongoose.mongo);
      gfs.collection("uploads");
      gfsAudio = Grid(mongoose.connection.db, mongoose.mongo);
      gfsAudio.collection("audios");
    });
  })
  .catch((error) => {
    console.log(error);
  });
