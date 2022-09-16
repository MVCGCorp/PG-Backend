const express = require("express");
const route = express.Router();
// const { Product, Review } = require("../db.js");
// const { Sequelize, Op, where } = require("sequelize");
const { STRIPE } = process.env;
const stripe = require("stripe")(STRIPE);

  const calculateOrderAmount = () => {
    return 57000;
  };
  
  route.post("/create-payment-intent", async (req, res) => {
    const { userId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(),
      description: userId,
      currency: "ars",
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  });
 
module.exports = route;