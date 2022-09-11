const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const productsRouter = require("./routes/products");
const categoryRouter = require("./routes/category");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order")
const paymentRouter = require("./routes/payment")
const reviewRouter = require("./routes/review")
const auth = require("./routes/auth")
const { CORS_URL } = process.env //variable de entorno local => CORS_URL=http://localhost:3000

require("./db.js");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CORS_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

app.use("/products", productsRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);
app.use("/review", reviewRouter);
app.use("/auth", auth);
app.use("/order", orderRouter);
app.use("/", paymentRouter);

app.get("/", (req, res) => {
  res.send(
    "<div><h1>HELLO!! Some usefull information</h1><br>To go to the products route click --><a href='/products'>/products</a></br><br>To go to the category routes click --> <a href='/category'>/category</a></br><br>To register new user go to post on --> /auth/signup</br><br>To log an existing user go to post on --> /auth/signin</br><br>To go to the users route click --> <a href='/user'>/user</a></br></div>"
  );
});

module.exports = app;
