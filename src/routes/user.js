const express = require("express");

const route = express.Router();

const { Product, Category, User } = require("../db.js");
const { Sequelize, Op } = require("sequelize");
const { Router } = require("express");



 route.get('/', (req, res, next) => {

    User.findAll()
       .then(users => {
        res.send(users);
      })
      .catch(next);
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


 route.post("/", async (req, res) =>{
   const {
    name,
    lastname,
    email,
    password,
    rol
    } =  req. body
 if (!name || !lastname || !email || !password ) {
     return res.status(400).send("Some data is missing");
 }
try{
    let userSaved = await User.findOrCreate({
        where: { name: name,
          lastname: lastname,
          email: email,
          password: password,
          rol: rol || 'user'
        },
      });
      
      return res.status(200).json(userSaved)

    } catch(error){
        console.log(error)
         res.status(400).send(error)
     }
})

route.put('/:id', async (req, res) => {
const { id } = req.params;
const {
  name,
  lastname,
  email,
  rol,
  password
} = req.body;
  if(!email && !name && !lastname && !password && !rol){ 
      res.status(400)
      .send('No estas modificando ningun campo')}

      try {
        const user = await User.update({
         name, lastname, email, rol, password
        },
        {where: {
          id: id
        }});
        res.status(200).send(`${user} has been modify`);
      } catch (error) {
        console.log(error)
        res.send(error);
      }
    });




module.exports = route;