const express = require("express");
const route = express.Router();
const { Order } = require("../db.js");
const { Sequelize, Op, where } = require("sequelize");
const { STRIPE } = process.env;
const stripe = require("stripe")(STRIPE);

const calculateOrderAmount = async (userId) => {
  try {
    const order = await Order.findOne({
      where: {
        id: userId,
        status: "carrito",
      },
    });

    const detail = await OrderDetail.findAll({
      where: {
        orderId: order.id,
      },
    });

    const precio_final = detail
      .map((data) => data.price * data.quantity)
      .reduce((a, b) => a + b, 0);

    return precio_final;
  } catch (error) {
    console.log(err);
  }
};

route.post("/create-payment-intent", async (req, res) => {
  const { userId } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(userId),
    description: userId,
    currency: "ars",
    automatic_payment_methods: { enabled: true },
  });
  console.log(email);
  res.send({ clientSecret: paymentIntent.client_secret });
});

module.exports = route;
