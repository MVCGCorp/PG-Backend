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
  const {userId, productId, price, quantity } = req.body;

let user_order
let amountFinal
  if (userId && productId && price && quantity) {
    const newOrder = await Order.create({
      status: "procesando",
    });
    await newOrder.setUser(userId);
    const orderDetail = await OrderDetail.create({
      price,
      quantity,
      orderId: newOrder.id,
      productId: productId,
    });
    user_order = `${userId}:${orderDetail.dataValues.orderId}`
    amountFinal = price * quantity * 100
    
  } else if (userId && !productId && !price && !quantity) {
    const order = await Order.findOne({
      where: {
        userId: userId,
        status: "carrito",
      },
    });

    const detail = await OrderDetail.findAll({
      where: {
        orderId: order.dataValues.id,
      },
    });
    user_order = `${userId}:${detail[0].dataValues.orderId}`
    amountFinal = calculateOrderAmount(detail)
  }

  if (userId) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountFinal,
    description: user_order,
    currency: "ars",
    automatic_payment_methods: { enabled: true },
  });
  res.send({ clientSecret: paymentIntent.client_secret });
} else {
  res.status(404).send({message: "missing data"});
}
});

module.exports = route;