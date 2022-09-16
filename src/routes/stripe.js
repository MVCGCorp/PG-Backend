const express = require("express");
const route = express.Router();
// const { Product, Review } = require("../db.js");
// const { Sequelize, Op, where } = require("sequelize");
const { STRIPE, WEBHOOK } = process.env;
const stripe = require("stripe")(STRIPE);

route.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    let charge;
    switch (event.type) {
      case "charge.succeeded":
        charge = event.data.object;
        console.log(charge.description);
        break;
      case "charge.failed":
        charge = event.data.object;
        console.log("charge faile");
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.send();
  }
);

module.exports = route;
