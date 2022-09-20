const express = require("express");
const route = express.Router();
const {User, Order, OrderDetail } = require("../db.js");
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
  const { userId, productId, price, quantity } = req.body;

  let user_order;
  let amountFinal;
  let orderDetail
  try {
    if (userId && productId && price && quantity) {
      const newOrder = await Order.create({
        status: "procesando",
      });
  
      await newOrder.addUser(userId);
  
      orderDetail = await OrderDetail.create({
        price,
        quantity,
        orderId: newOrder.id,
        productId: productId,
      });
  
      user_order = `${userId}:${orderDetail.dataValues.orderId}`;
      amountFinal = price * quantity * 100;
  
    } else if (userId && !productId && !price && !quantity) {
      const order = await Order.findOne({
        where: {
          userId: userId,
          status: "carrito",
        },
      });
  
      if (order) {
        orderDetail = await OrderDetail.findAll({
          where: {
            orderId: order.dataValues.id,
          },
        });
  
        
        if (orderDetail.dataValues) {
          user_order = `${userId}:${orderDetail[0].dataValues.orderId}`;
          amountFinal = calculateOrderAmount(orderDetail);
        }
      }
    }
  
    if (userId && user_order && amountFinal) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountFinal,
        description: user_order,
        currency: "ars",
        automatic_payment_methods: { enabled: true },
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    } else {
      res.status(404).send({ message: "missing data" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error)
  }


});

module.exports = route;
