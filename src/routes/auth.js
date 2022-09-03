const express = require("express");

const router = express.Router();

const { User } = require("../db.js");
const { Sequelize, Op } = require("sequelize");

const AuthController = require("../Controllers/AuthController");



router.get('/', (req,res)=> res.json({hello}));

router.post('/signin', AuthController.signIn);
router.post('/signup', AuthController.signUp);

module.exports = router