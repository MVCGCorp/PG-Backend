require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;
//configurar DB_USER, DB_PASSWORD, DB_HOST, DB_NAME en HEROKU

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: DB_NAME, 
        dialect: "postgres",
        host: DB_HOST,
        port: DB_PORT, //5432 on .env
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pfdatabase`, {
        logging: false,
        native: false,
      });

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Product, Category, User, Order, OrderDetail, Review, Favourites, Image } = sequelize.models;

// console.log('order', OrderDetail)

// Model1.belongsToMany(Model2, { through: "TabalIntermedia" });
// Model2.belongsToMany(Model1, { through: "TabalIntermedia" });

Product.belongsToMany(Category, {through: "ProductCategory"});
Category.belongsToMany(Product, {through: "ProductCategory"});


User.hasMany(Order);//crea "UserId" en Order
Order.belongsTo(User) ;//, {through: "OrderUser"}
// Order.belongsTo(User) // no necesita segunda parametro
// Order.hasMany(OrderDetail) //crea "OrderId" en OrderDetail
// Product.hasMany(OrderDetail) //crea "ProductId" en OrderDetail

Product.hasMany(Review);
Review.belongsTo(Product);

Product.hasMany(Image);
Image.belongsTo(Product);

User.hasMany(Review);
Review.belongsTo(User);

Order.belongsToMany(Product, { through: OrderDetail});
Product.belongsToMany(Order, { through: OrderDetail});



User.belongsToMany(Product, {through: Favourites});
Product.belongsToMany(User, {through: Favourites});


module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
