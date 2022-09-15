module.exports = (req, res, next) => {    
    if (req.body.user.rol === "admin" || req.body.user.rol === "mododios") {
		console.log('Bienvenido Administrador')
				next();
	} else {
		console.log('Acceso no autorizado')
		res.status(401).json({ msg: "Acceso no autorizado" })
	}
}
