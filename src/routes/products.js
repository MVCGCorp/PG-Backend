const express = require("express");

const route = express.Router();

const { Product, Category, Review } = require("../db.js");
const { Sequelize, Op } = require("sequelize");

const isAdmin = require('../Middlewares/isAdmin.js')

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
        include: [
          {
            model: Category,
            through: {
              attributes: [],
            },
            attributes: ["id", "name"],
          },
        ],
      });
      return product_Name.length
        ? res.status(200).send(product_Name)
        : res.status(404).send("Product Not Found");
    } else {
      const product_All = await Product.findAll({
        include: [
          {
            model: Category,
            through: {
              attributes: [],
            },
            attributes: ["id", "name"],
          },
        ],
      });
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
  const { id } = req.params;
  if (id) {
    try {
      const product_Id = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
          {
            model: Review,
            attributes: ["id", "description", "ranking", "createdAt"],
          },
        ],
      });
      return product_Id
        ? res.status(200).json(product_Id)
        : res.status(404).send("Product Not Found");
    } catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  }
});

//POST: crear nuevo producto. faltaria validar que solo pueda hacerlo un admin
route.post("/", isAdmin, async (req, res, next) => {
  const {
    name,
    longDescription,
    price,
    stock,
    image,
    status,
    shortDescription,
    category,
  } = req.body;
  if (!name || !longDescription || !price || !stock || !category) {
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
        status: status || false,
      },
    });
    const match = await Category.findAll({
      where: {
        name: category,
      },
    });
    await productSaved.addCategory(match);
    return !created
      ? res.status(404).send(`${name} already exist`)
      : res.status(200).json(productSaved);
  } catch (err) {
    console.log(err.message);
    res.status(404).json(err.message);
  }
});

// DELETE: eliminar producto

route.put("/delete/:id", isAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id,
      },
    });
    return res.json(`${deletedProduct} product has been deleted`);
  } catch (error) {
    console.log(error);
  }
});

route.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    longDescription,
    price,
    stock,
    image,
    status,
    shortDescription,
    category,
  } = req.body;
  console.log(price);

  // if (!id){ return res.status(404).send("Product id is required")}

  try {
    if (category) {
      const product = await Product.findByPk(id);
      // console.log('product', product.toJSON())
      const match = await Category.findAll({
        where: {
          name: category,
        },
      });
      // console.log('match', match.toJSON())
      if (match) {
        await product.setCategories(match);
      }
    }

    const product_Id = await Product.update(
      {
        name,
        longDescription,
        price,
        stock,
        image,
        status,
        shortDescription,
        category,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send(`${product_Id} product has been modify`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = route;
