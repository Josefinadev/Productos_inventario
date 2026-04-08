require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "Cluster0";

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("La variable MONGODB_URI no esta definida");
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB
  });

  console.log("Conectado a MongoDB con Mongoose");
}

module.exports = connectDB;
