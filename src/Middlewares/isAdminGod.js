module.exports = (req, res, next) => {    
    if (req.loginUser.rol === "mododios") {
		console.log('Bienvenido Dios')
				next();
	} else {
		console.log('Acceso no autorizado')
		res.status(401).json({ msg: "Acceso no autorizado" })
	}
}