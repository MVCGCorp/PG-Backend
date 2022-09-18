const express = require("express");
const route = express.Router();
const { Order, OrderDetail } = require("../db.js");
const { STRIPE } = process.env;
const stripe = require("stripe")(STRIPE);

const calculateOrderAmount = (detail) => {
  try {
    const precio_final =
      detail
        .map((data) => data.dataValues.price * data.dataValues.quantity)
        .reduce((a, b) => a + b, 0) * 100;

    return precio_final;
  } catch (error) {
    console.log(error);
  }
};

route.post("/create-payment-intent", async (req, res) => {
  const { userId } = req.body;

  const order = await Order.findOne({
    where: {
      userId: userId,
      status: "carrito",
    },
  });

  const detail = await OrderDetail.findAll({
    where: {
      orderId: order.dataValues.id
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(detail),
    description: `${userId}`,
    currency: "ars",
    automatic_payment_methods: { enabled: true },
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

module.exports = route;
