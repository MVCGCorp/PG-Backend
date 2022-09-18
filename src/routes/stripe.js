const express = require("express");
const route = express.Router();
const { Order } = require("../db.js");
const { STRIPE, WEBHOOK } = process.env;
const stripe = require("stripe")(STRIPE);

route.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const userId = Number(event.data.object.description);

    const order = await Order.findOne({
      where: {
        userId: userId,
        status: "carrito",
      },
    });

    if (order) {
    await order.update({
      status:
        event.type === "charge.succeeded"
          ? "success"
          : event.type === "charge.failed"
          ? "faile"
          : "processing",
    }) }
    console.log(event.type)
    res.send({message: event.type})

  }
);

module.exports = route;
