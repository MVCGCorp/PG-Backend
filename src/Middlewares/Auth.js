const jwt = require('jsonwebtoken');
const authConfig = require("../Controllers/Auth")

module.exports = (req,res, next)=> {
    if (!req.headers.authorization) {
        res.status(401).json({msg: "Unauthorized access"})
    }else {
        let token = req.headers.authorization.split(" ")[1];

        jwt.verify(token,authConfig.secret, (err, decoded) => {
            if(err){
                res.status(500).json({ msg: "Token error", err});
            }else{
                next();
            }
        })
    }
}