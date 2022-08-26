const express = require("express");

const route = express.Router();

const { Product, Category } = require("../db.js");
const { Sequelize, Op } = require("sequelize");

//GET:todos los productos
//Cambie de promesas a async await para poder tener un mejor manejo de errores.
//Utilizo un ternario en el return para en el caso que vuelva un arreglo vacio se pueda enviar un mensaje de que no se encontraron productos.
//dejo comentadas algunas lineas de promesas por si se me paso algun dato o haya que modificar algo. Despues cuando ya quede eliminamos los comentarios.
//Fede.
route.get("/", async (req, res, next) => {
  const { query } = req.query;
  const name = query.toLowerCase();
  try {
    if (name) {
      // let lowerName = name.toLowerCase()
      const product_Name = await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${name}%` } },
            { description: { [Op.iLike]: `%${name}%` } },
          ],
        },
        include: Category,
      });
      // .then(function(products) {
      //         res.send(products)
      // }).catch(next);
      return product_Name.length
        ? res.status(200).send(product_Name)
        : res.status(404).send("Product Not Found");
    } else {
      const product_All = await Product.findAll();

      return product_All.length
        ? res.status(200).send(product_All)
        : res.status(404).send("No products on DataBase");

      // .then(products => {
      //   res.send(products);
      // }).catch(next);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// //GET:todos los productos
// route.get('/', (req, res, next) => {
//     const { name } = req.query
//     if(name){
//       let lowerName = name.toLowerCase()
//         Product.findAll({
//             where: {
//                 [Op.or]: [
//                 { name:{[Op.iLike]: `%${lowerName}%`} },
//                 { description:{[Op.iLike]:  `%${lowerName}%`}}
//                 ]},
//                 include: Category})
//             .then(function(products) {
//                     res.send(products)
//             }).catch(next);
//     }else {
//         Product.findAll()
// 			.then(products => {
// 				res.send(products);
// 			}).catch(next);
//     }

// 	});

//GET: todos los detalles de un producto
//Cambie de promesas a async await para poder tener un mejor manejo de errores.
//Fede
route.get("/:id", async (req, res, next) => {
  const id = Number(req.params);
  if (id) {
    try {
      const product_Id = await Product.findByPk(id, { include: Category });
      return countryId
        ? res.status(200).json(product_Id)
        : res.status(404).send("Product Not Found");
    } catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  }
});

//POST: crear nuevo producto. faltaria validar que solo pueda hacerlo un admin
//Cambie de promesas a async await para poder tener un mejor manejo de errores.
//Cambie "create" por "findorcreate" para chequear que el producto no exista todavia, si existe devuelve en la variable "created" un false y la tomo en el condicional para devolver un mensaje de error informando que ya existe ese producto. 
//en caso de que haya algun error el catch lo captura y devuelve el mensaje de error. 
//Fede
route.post("/", async (req, res, next) => {
  const {
    name,
    longDescription,
    price,
    stock,
    image,
    statusId,
    shortDescription,
  } = req.body;
  if (!name || !longDescription || !price || !stock) {
    return res.status(400).send("Some data is missing");
  }
  try {
    let [row, created] = await Product.create({
      name: name,
      longDescription: longDescription,
      shortDescription: shortDescription,
      price: price,
      stock: stock,
      image: image,
      status: statusId,
    });
    return !created
      ? res.status(404).send(`${name} already exist`)
      : res.status(200).json(row);
  } catch (err) {
    console.log(err.message);
    res.status(404).json(err.message);
  }
});

// DELETE: eliminar producto, falta validacion para que solo lo pueda hacer el admin

route.delete('/:id', async (req, res, next) => {
  const { id } = Number(req.params)
      try{
          const deletedProduct = await Product.destroy({
              where:{
                  id
              }
          });
          return res.json(deletedProduct)
      }catch(error){
          next(error)
      }
  });

module.exports = route;
