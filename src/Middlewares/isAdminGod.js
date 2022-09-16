module.exports = (req, res, next) => {
	const { rol } = req.body;
    if (rol === "mododios") {
		console.log('Bienvenido Administrador')
				next();
	} else {
		console.log('Acceso no autorizado')
		res.status(401).json({ msg: "Acceso no autorizado" })
	}
}
