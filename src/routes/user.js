const express = require("express");

const route = express.Router();

const { Product, Category, User } = require("../db.js");
const { Sequelize, Op } = require("sequelize");
const { Router } = require("express");

route.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users.length) {
      return res.send("No users on db");
    }
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

route.get("/:id", async (req, res, next) => {
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

module.exports = route;
