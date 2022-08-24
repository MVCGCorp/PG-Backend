const express = require("express");

const route = express.Router();

const { Product, Category} = require('../db.js');
const { Sequelize, Op } = require('sequelize')

//GET:todos los productos
route.get('/', (req, res, next) => {
    const { name } = req.query
    if(name){
      let lowerName = name.toLowerCase()
        Product.findAll({
            where: {
                [Op.or]: [
                { name:{[Op.iLike]: `%${lowerName}%`} },
                { description:{[Op.iLike]:  `%${lowerName}%`}}
                ]},
                include: Category})
            .then(function(products) {
                    res.send(products)
            }).catch(next);
    }else {
        Product.findAll()
			.then(products => {
				res.send(products);
			}).catch(next);
    }
        
	});

//GET: todos los detalles de un producto
route.get('/:id', (req, res, next) => {
    if(req.params.id === Number(req.params.id)){
        Product.findByPk(req.params.id,
    {include : Category})
            .then(function(product) {
                res.send(product)})
            .catch(next);
}else{  
    next();}
});

//POST: crear nuevo producto. faltaria validar que solo pueda hacerlo un admin
route.post('/', (req, res, next) => {
    const { name, longDescription, price, stock, image, statusId, shortDescription} = req.body
    if(!name || !longDescription || !price || !stock){ 
        res.status(400)
        .send('Some data is missing')
    }else{
    Product.create({
            name: name,
            longDescription: longDescription,
            shortDescription: shortDescription,
            price: price,
            stock: stock,
            image: image,
            status: statusId
        }).then(function (product) {
            res.status(201)
            res.send(product)
        }).catch(next);}

});

module.exports = route;
