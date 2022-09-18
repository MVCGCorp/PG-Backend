const express = require("express");
const route = express.Router();
const { Order } = require("../db.js");
const { STRIPE, WEBHOOK } = process.env;
const stripe = require("stripe")(STRIPE);

route.post("/webhook", express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK);
    } catch (err) {
      res.status(400).send(`Cane-Food Webhook Error: ${err.message}`);
      return;
    }
    const user_order = event.data.object.description.split(":");
    const orderId = user_order[1];

    const orderBuy = await Order.findOne({
      where: {
        id: orderId,
      },
    });

    await orderBuy.update({
      status:
        event.type === "charge.succeeded"
          ? "completada"
          : event.type === "charge.failed"
          ? "rechazada"
          : "procesando",
    });
    res.send({message: "proceso finalizado"})
  });

module.exports = route;
