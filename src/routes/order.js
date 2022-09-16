const express = require("express");

const route = express.Router();

const { Product, User, Order, OrderDetail } = require("../db.js");

const isAdmin = require("../Middlewares/isAdmin.js");

// Ruta GET para traer todas las ordenes o filtradas por status

route.put("/", isAdmin, async (req, res) => {
  const status = req.query.status;
  //   console.log("statusss", status);
  try {
    if (status) {
      const allOrdersByStatus = await Order.findAll({
        where: {
          status: status,
        },
      });
      console.log("allOrdersByStatus", allOrdersByStatus);
      return allOrdersByStatus.length
        ? res.status(200).send(allOrdersByStatus)
        : res.status(404).json({ msg: "Order not found" });
    }

    const allOrders = await Order.findAll();
    // console.log("allOrders", allOrders);
    return allOrders
      ? res.status(200).send(allOrders)
      : res.status(404).json({ msg: "Order not found" });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

// Ruta GET para traer una orden por ID

route.put("/:id", isAdmin, async (req, res) => {
  const orderId = req.params;
  console.log("IDD", orderId.id);
  try {
    //Busca un orden en particular
    if (orderId) {
      const orderById = await Order.findByPk(orderId.id);
      //   console.log("orderById", orderById);
      return orderById
        ? res.status(200).send(orderById)
        : res.status(404).json({ msg: "Order not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

//Ruta PUT para modificar el estado de la orden

route.put("/:id", isAdmin, async (req, res) => {
  const orderId = req.params;
  const status = req.body;

  //   console.log("id", orderId.id)
  //   console.log("status", status.status)
  try {
    const orderPK = await Order.findByPk(orderId.id);
    const orderUpdate = await orderPK.update({
      status: status.status,
    });
    if (orderUpdate)
      return res.send(
        `Status Order number ${orderId.id} has been updated to ${status.status}`
      );

    return res.status(400).json({ msg: "Update cannot de done" });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

module.exports = route;
