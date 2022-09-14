const express = require("express");
const route = express.Router();
const { Product, Review } = require("../db.js");
const { Sequelize, Op, where } = require("sequelize");
// const { query } = require("express");

route.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(404).send("Review Not Found");
  }
});

route.post("/", async (req, res, next) => {
  const { productId, description, ranking } = req.body;
  if (!productId || !description || !ranking) {
    return res.status(400).send("Some data is missing");
  }

  try {
    let product = await Product.findByPk(productId);

    if (product) {
      let review = await Review.create({
        description: description,
        ranking: ranking,
      });
      await product.addReview(review);

      res.status(200).send({ message: "saved review" });
    } else {
      res.status(400).send({ message: "product not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).json(err.message);
  }
});

route.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedReview = await Review.destroy({
      where: {
        id,
      },
    });
    return res.json(`${deletedReview} review has been deleted`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = route;