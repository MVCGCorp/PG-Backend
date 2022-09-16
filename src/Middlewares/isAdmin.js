module.exports = (req, res, next) => {
  const { rol, user } = req.body;
  console.log(rol, user);
  if (rol === "admin" || rol === "mododios") {
    console.log("Bienvenido Administrador");
    next();
  } else {
    console.log("Acceso no autorizado");
    res.status(401).json({ msg: "Acceso no autorizado" });
  }
};
