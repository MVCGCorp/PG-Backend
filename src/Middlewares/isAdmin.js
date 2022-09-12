module.exports = (req, res, next) => {    
    if (req.user.rol === "admin") {
		console.log('Bienvenido Administrador')
				next();
	} else {
		console.log('Acceso no autorizado')
		res.status(401).json({ msg: "Acceso no autorizado" })
	}
}