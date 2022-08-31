const server = require("./src/app.js");
const { conn } = require("./src/db.js");

conn.sync({ force: true }).then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`%s listening at ${process.env.PORT}`); //variable de entorno local => PORT=3001
  });
});
