const mongoose = require("mongoose");

const categoriasPermitidas = ["Electronica", "Ropa", "Alimentos"];

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede superar los 100 caracteres"]
    },
    descripcion: {
      type: String,
      required: [true, "La descripcion es obligatoria"],
      trim: true,
      minlength: [5, "La descripcion debe tener al menos 5 caracteres"],
      maxlength: [500, "La descripcion no puede superar los 500 caracteres"]
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"]
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un numero entero"
      }
    },
    categoria: {
      type: String,
      required: [true, "La categoria es obligatoria"],
      enum: {
        values: categoriasPermitidas,
        message: "La categoria seleccionada no es valida"
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = {
  Product: mongoose.model("Product", productSchema),
  categoriasPermitidas
};
