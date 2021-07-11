const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes/route.js');
const authMiddleware = require('./middleware/auth.middleware');

require("dotenv").config({
 path: path.join(__dirname, "./.env")
});

const app = express();

const PORT = process.env.PORT || 3000;

mongoose
 .connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
  }).then(() => {
  console.log('Connected to the Database successfully');
 });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(authMiddleware.verifyToken);

app.use('/', routes); app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})
