require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("Intentando conectar a MongoDB Atlas con Mongoose...");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "Cluster0"
    });
    console.log("Conexion exitosa a MongoDB Atlas");
    console.log("Base de datos activa:", mongoose.connection.name);
  } catch (error) {
    console.error("Error de conexion:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

testConnection();
