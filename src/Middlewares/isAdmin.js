module.exports = (req, res, next) => {
  if (
    req.body.loginUser.rol === "admin" ||
    req.body.loginUser.rol === "mododios"
  ) {
    console.log("Bienvenido Administrador");
    next();
  } else {
    console.log("Acceso no autorizado");
    res.status(401).json({ msg: "Acceso no autorizado" });
  }
};
