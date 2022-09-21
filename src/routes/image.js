const express = require("express");
const route = express.Router();
const { Product, Image } = require("../db.js");
const { Sequelize, Op, where } = require("sequelize");
const isAdmin = require('../Middlewares/isAdmin.js')

// Llamar a todas la imagenes de la base de datos
route.get("/", async (req, res) => {
  try {
    const image = await Image.findAll();
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json("Images Not Found");
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).send(error.message);
  }
});

// Llamar a las imagenes de un producto especifico
route.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const image = await Image.findAll({
      where: {
        productId: productId,
      },
    });

    if (image.length) {
      res.status(200).json(image);
    } else {
      res.status(404).send("image Not Found");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error.message);
  }
});

// crear un imagen y asignarla a un producto especifico
route.post("/:productId", isAdmin, async (req, res) => {
  const { url } = req.body;
  const { productId } = req.params

  if (!productId && !url) {
    return res.status(400).send("Some data is missing");
  }

  try {
    let [image, created] = await Image.findOrCreate({
      where: {
        url: url,
      },
    });

    if (created) {
      let product = await Product.findByPk(productId);

      if (product) {
        await product.addImage(image.id);

        image = await Image.findByPk(image.id);

        res.status(200).json(image);
      } else {
        res.status(404).send("product Not Found");
      }
    } else {
      res.status(404).send("repeated image");
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).send(error.message);
  }
});

// Eliminar una imagen especifica
route.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).send("missing data");
  }

  try {
    const deletedImage = await Image.destroy({
      where: {
        id,
      },
    });

    if (deletedImage) {
      res.status(200).send(`image #${id} deleted`);
    } else {
      res.status(404).send("Image Not Found");
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).send(error.message);
  }
});

module.exports = route;
