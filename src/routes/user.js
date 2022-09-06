const express = require("express");

const route = express.Router();

const { Product, User, Order, OrderDetail } = require("../db.js");

route.get("/", (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.send(users);
    })
    .catch(next);
});

route.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      const user_Id = await User.findByPk(id);
      return user_Id
        ? res.status(200).json(user_Id)
        : res.status(404).send("User Not Found");
    } catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  }
});

route.post("/", async (req, res) => {
  const {
    given_name,
    family_name,
    email,
    // password,
    // rol
  } = req.body;
  if (!given_name || !family_name || !email) {
    return res.status(400).send("Some data is missing");
  }
  try {
    let userSaved = await User.findOrCreate({
      where: {
        given_name: given_name,
        family_name: family_name,
        email: email,
        // password: password,
        // rol: rol || 'user'
      },
    });

    return res.status(200).json(userSaved);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

route.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    given_name,
    family_name,
    email,
    nickname,
    // rol,
    // password
  } = req.body;
  if (!email && !given_name && !family_name) {
    res.status(400).send("No estas modificando ningun campo");
  }

  try {
    const user = await User.update(
      {
        given_name,
        family_name,
        email,
        nickname,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send(`${user} has been modify`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

route.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const userId = await User.destroy({
      where: {
        id,
      },
    });
    return res.status(200).send(`${userId} deleted`);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

//Rutas carrito.

//Post Order
//Se crea la orden de un usuario con el valor de Status por defecto en "carrito";
//La idea es que a medida que avanza la comprar se vaya actualizando el status de la orden.
// Pendiente hacer las rutas de orden.
//Pendiente charlar con la gente de Front si estas siguiendo la misma idea

route.post("/:id/cart", (req, res) => {
  const { productId, price, quantity } = req.body;
  const { id } = req.params;
  console.log("id", id);
  console.log("productId", productId);
  if (id) {
    Order.findOne({ where: { id: id, status: "carrito" } })
      .then((order) => {
        if (!order) {
          return Order.create({
            status: "carrito",
          });
        }
        return order;
      })
      .then((order) => {
        return order.setUser(id);
      })
      .then((order) => {
        if (productId) {
          return OrderDetail.create({
            price,
            quantity,
            orderId: order.id,
            productId: productId,
          });
        }

        return order;
      })
      .then((order) => {
        console.log("orderrrrr", order);
        return res.status(200).send(order);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  } else {
    return res.status(200).json("User missing");
  }
});

//GET --> los productos del carrito de un usuario
route.get("/:id/order/:status", (req, res) => {
  let { id, status } = req.params;

  Order.findOne({
    where: {
      id: id,
      status: status
    }
  }).then((order) => {
    OrderDetail.findAll({
      where: {
        orderId: order.id,
      }
    })
      .then(orderdetail => {
        res.status(200).json(orderdetail)
      })

  }).catch((err) => {
    res.status(400).json("Not possible to bring order detail" + err)
  })
});

//GET--> las ordenes de un usuario
route.get("/:id/orders", async (req, res) => {
  const { id } = req.params;

  try {
    const order_All = await Order.findAll({
      where: {
        userId: id,
      },
      include: OrderDetail
    });
    console.log(order_All);
    return order_All.length
      ? res.status(200).send(order_All)
      : res
          .status(404)
          .json({ message: "There are not orders for given user" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

//DELETE --> vaciar el carrito
route.delete("/:id/cart", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(404).send("you need an ID");

    const deletedOrder = await Order.destroy({
      where: {
        userId: id,
        status: "carrito",
      },
    });

    return res.json({ message: `${deletedOrder} has been deleted` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

//DELETE --> eliminar producto

route.delete("/:id/cart/delete", async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;
  try {
    if (!id) return res.status(404).send("You need an ID");

    const deletedProduct = await OrderDetail.destroy({
      where: {
          productId,
        },
      });
 return res.status(200).send(`${deletedProduct} has been deleted`);

  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = route;
