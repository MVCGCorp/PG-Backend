const express = require("express");
const route = express.Router();
const {User, Order, OrderDetail } = require("../db.js");
const { STRIPE } = process.env;
const stripe = require("stripe")(STRIPE);
const { Op } = require("sequelize");

route.post("/create-payment-intent", async (req, res) => {
  const { userId } = req.body;
  const user = User.findByPk(userId);

  if (!userId) {
    return res.status(404).send("Enter a user");
  }

  if (!user) {
    return res.status(404).send("User not fount");
  }

  try {
    let orderDetail, order, user_order, precio_final;

    order = await Order.findOne({
      where: {
        userId: userId,
        [Op.or]: [
          { status: "carrito" },
          { status: "procesando" }
        ]
      }     
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    orderDetail = await OrderDetail.findAll({
      where: {
        orderId: order.dataValues.id,
      },
    });

    if (!orderDetail) {
      return res.status(404).send("OrderDetail not found");
    }

    user_order = `${userId}:${orderDetail[0].dataValues.orderId}`;
    precio_final =
      orderDetail
        .map((data) => data.dataValues.price * data.dataValues.quantity)
        .reduce((a, b) => a + b, 0) * 100;

    if (!user_order || !precio_final) {
      return res.status(404).send("OrderDetail Error");
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: !precio_final,
      description: user_order,
      currency: "ars",
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error.message);
    res.status(404).send(error.message);
  }
});
  
module.exports = route;