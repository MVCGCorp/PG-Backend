module.exports = (req, res, next) => {    
    if (req.loginUser.rol === "admin" || req.loginUser.rol === "mododios") {
		console.log('Bienvenido Administrador')
				next();
	} else {
		console.log('Acceso no autorizado')
		res.status(401).json({ msg: "Acceso no autorizado" })
	}
}