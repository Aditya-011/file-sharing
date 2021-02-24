require("dotenv").config();
const mongoose = require("mongoose");
// function to connect cloud storage "connectDB()"
function connectDB() {
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
  const connection = mongoose.connection;
  connection
    .once("open", () => {
      console.log("DB Connected Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = connectDB;
