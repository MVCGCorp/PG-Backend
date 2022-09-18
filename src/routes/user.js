const express = require("express");

const route = express.Router();
const { Product, User, Order, OrderDetail, Favourites } = require("../db.js");

const isAdminGod = require("../Middlewares/isAdminGod.js");


route.get("/", async (req, res, next) => {
  const { email } = req.query;
  try {
    if (email) {
      const userEmail = await User.findOne({
        where: {
          email: email,
        },
      });
      return userEmail
        ? res.status(200).send(userEmail)
        : res.status(404).send("user not found");
    }
    const users = await User.findAll();
    return users
      ? res.status(200).send(users)
      : res.status(404).send("No users on DB");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
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
  const { given_name, family_name, email, rol, nickname, picture } = req.body;
  if (!email) {
    return res.status(400).send("Some data is missing");
  }
  try {
    let userSaved = await User.findOrCreate({
      where: {
        given_name: given_name || "incompleted",
        family_name: family_name || "incompleted",
        email: email,
        nickname: nickname || "incompleted",
        rol: rol || "user",
        picture: picture || "img not found",
      },
    });

    return res.status(200).json(userSaved);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/*
MODIFICA ROL DEL USUARIO
*/

// PUT SOLO A ROL
//  isAdminGod,
route.put("/change/:id", isAdminGod, async (req, res) => {
  const { id } = req.params;
  const { rol } = req.query;
  const { isDisable } = req.body;
  //if (!userRol && !isDisable) {
  // res
  //   .status(400)
  //    .send("Faltan datos");
  //  }

  try {
    const user = await User.update(
      {
        rol,
        isDisable,
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

route.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { given_name, family_name, email, nickname, picture } = req.body;
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
        picture,
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

route.delete("/:id", isAdminGod, async (req, res, next) => {
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

//Ruta POST para agregar productos al carrito

route.post("/:id/cart", (req, res) => {
  const productId = req.body.prodTotal.prodDetail.id;
  const price = req.body.prodTotal.prodDetail.price;

  const quantity = req.body.prodTotal.quantity;
  const { id } = req.params;
  if (id) {
    Order.findOne({ where: { userId: id, status: "carrito" } })
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
        return res.status(200).send(order);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  } else {
    return res.status(200).json("User missing");
  }
});

//Ruta GET para traer los productos del carrito de un usuario

route.get("/:id/order", (req, res) => {
  //  let { id } = req.params;
  let { id } = req.query;

  //  Order.findOne({
  //    where: {
  //      userId: id,
  //      status: status,
  //    },
  //  })
  //    .then((order) => {
  OrderDetail.findAll({
    where: {
      orderId: id,
    },
  })
    .then((orderdetail) => {
      res.status(200).json(orderdetail);
    })
    //    })
    .catch((err) => {
      res.status(400).json("Order not found" + err);
    });
});

//Ruta GET para calcular el precio final de venta
route.get("/:id/precio_final", async (req, res) => {
  let { id } = req.params;

  try {
    const order = await Order.findOne({
      where: {
        userId: id,
        status: "carrito",
      },
    });

    
    const detail = await OrderDetail.findAll({
      where: {
        orderId: order.dataValues.id,
      },
    });

    const precio_final = detail
      .map((data) => data.price * data.quantity)
      .reduce((a, b) => a + b, 0);

    res.status(200).json({precio_final: precio_final});
  } catch (error) {
    res.status(404).send({menssage: "id not found"});
  }
});
//Ruta GET para traer las ordenes de un usuario
route.get("/:id/orders", async (req, res) => {
  const { id } = req.params;

  try {
    const order_All = await Order.findAll({
      where: {
        userId: id,
      },
    });
    console.log(order_All);
    return order_All.length
      ? res.status(200).send(order_All)
      : res.status(404).json({ message: "User has not active orders" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

//Ruta DELETE para eliminar o "vaciar" el carrito

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

//Ruta DELETE para eliminar un producto

route.delete("/:id/cart/delete", async (req, res) => {
  const userId = req.params.id;
  const productId = req.query.id;
  try {
    if (!userId) return res.status(404).send("You need an ID");

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

//Ruta PUT para modificar la cantidad de un item del carrito

route.put("/:id/cart", async (req, res) => {
  const userId = req.params;
  const { productId, quantity, orderId } = req.body;

  try {
    const quantityUpdate = await OrderDetail.update(
      {
        quantity: quantity,
      },
      {
        where: {
          orderId: orderId,
          productId: productId,
        },
      }
    );
    // console.log(quantityUpdate);
    if (quantityUpdate)
      return res.send(`${quantityUpdate} product quantity has been updated`);

    return res.status(400).json({ msg: "Update cannot be done" });
  } catch (error) {
    res.status(404).send(error);
  }
});

/*
 RUTAS A FAVORITOS/WISHLIST
*/

route.post("/favourites/:id", async (req, res) => {
  let { id } = req.params
  let { productId } = req.body

  console.log('id', id)
  console.log('productId', productId)
  
  if (!productId) {
    return res.status(400).send("Some data is missing");
  }
  try {
    let [favSaved, Created] = await Favourites.findOrCreate({
      where: { 
        userId: id,
        productId: productId
      },
    });
    // await favSaved.addProduct(productId, { through: Favourites });
    return !Created
      ? res.status(404).send(`${productId} is already in your wishlist`)
      : res.status(200).json(Created);
  } catch (err) {
    console.log(err.message);
    res.status(404).json(err.message);
  }
  });


  route.get("/favourites/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (id) {
          let favs = await Favourites.findAll({ 
            where: { userId: id },
          });
          res.json(favs)
          console.log('fav', favs)
      } else {
          res.status(404).send({ msg: "Faltan datos" });
      }
  } catch (err) {
      console.log(err);
  }
    });

module.exports = route;
