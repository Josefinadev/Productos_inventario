const { Product } = require("../models/Product");

function normalizeProductPayload(body) {
  return {
    nombre: body.nombre,
    descripcion: body.descripcion,
    precio: Number(body.precio),
    stock: Number(body.stock),
    categoria: body.categoria
  };
}

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(normalizeProductPayload(req.body));
    return res.status(201).json({
      message: "Producto creado correctamente",
      product
    });
  } catch (error) {
    return next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      normalizeProductPayload(req.body),
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({
      message: "Producto actualizado correctamente",
      product
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
