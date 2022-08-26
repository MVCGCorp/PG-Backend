const express = require("express");

const route = express.Router();

const { Product, Category } = require("../db.js");
const { Sequelize, Op } = require("sequelize");

//GET:todos los productos
route.get("/", async (req, res, next) => {
  let { name } = req.query;
  name ? (name = name.toLowerCase()) : null;

  try {
    if (name) {
      let product_Name = await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${name}%` } },
            { longDescription: { [Op.iLike]: `%${name}%` } },
          ],
        },
        // include: Category,
      });
      console.log(product_Name);
      return product_Name.length
        ? res.status(200).send(product_Name)
        : res.status(404).send("Product Not Found");
    } else {
      const product_All = await Product.findAll();

      return product_All.length
        ? res.status(200).send(product_All)
        : res.status(404).send("No products on DataBase");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//GET: todos los detalles de un producto
route.get("/:id", async (req, res, next) => {
  const id = Number(req.params);
  if (id) {
    try {
      const product_Id = await Product.findByPk(id, { include: Category });
      return countryId
        ? res.status(200).json(product_Id)
        : res.status(404).send("Product Not Found");
    } catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  }
});

//POST: crear nuevo producto. faltaria validar que solo pueda hacerlo un admin
route.post("/", async (req, res, next) => {
  const {
    name,
    longDescription,
    price,
    stock,
    image,
    statusId,
    shortDescription,
  } = req.body;
  if (!name || !longDescription || !price || !stock) {
    return res.status(400).send("Some data is missing");
  }
  try {
    let [productSaved, created] = await Product.findOrCreate({
      where: { name: name },
      defaults: {
        longDescription: longDescription,
        shortDescription: shortDescription,
        price: price,
        stock: stock,
        image: image,
        status: statusId,
      },
    });
    return !created
      ? res.status(404).send(`${name} already exist`)
      : res.status(200).json(productSaved);
  } catch (err) {
    console.log(err.message);
    res.status(404).json(err.message);
  }
});

// DELETE: eliminar producto, falta validacion para que solo lo pueda hacer el admin

route.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id,
      },
    });
    return res.json(deletedProduct);
  } catch (error) {
    console.log(error);
  }
});

module.exports = route;
