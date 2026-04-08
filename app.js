require("dotenv").config();
const express = require("express");
const path = require("path");

const connectDB = require("./db");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.render("home", {
    title: "Gestion de Productos",
    categorias: ["Electronica", "Ropa", "Alimentos"]
  });
});

app.use("/productos", productRoutes);

app.use((req, res) => {
  if (req.accepts("html")) {
    return res.status(404).render("404", { title: "Pagina no encontrada" });
  }

  return res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Error interno del servidor";

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Datos invalidos",
      errors: Object.values(error.errors).map((detail) => detail.message)
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "ID de producto invalido" });
  }

  if (res.headersSent) {
    return next(error);
  }

  return res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  startServer();
}

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la aplicacion:", error.message);
    process.exit(1);
  }
}

module.exports = app;
