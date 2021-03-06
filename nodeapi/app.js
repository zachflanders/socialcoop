const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require('path');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressValidator = require("express-validator");
const fs = require('fs');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config()

//connect to db
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
.then(()=>{console.log('DB Connected.')})

mongoose.connection.on('error', err =>{
  console.log(`DB connection error: ${err.message}`);
})

//bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/api/", postRoutes);
app.use("/api/", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/", commentRoutes);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: "unauthorized"});
  }
});
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../react-front/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../react-front/build', 'index.html'));
  });
}
const port = process.env.PORT || 8080;
app.listen(port, ()=>{
  console.log(`A Node JS API is listening on port ${port}`)
});
