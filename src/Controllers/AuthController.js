
const jwt = require('jsonwebtoken');
const authConfig = require('./Auth')
const {  User } = require("../db.js");


module.exports = {
    signIn (req, res){

        let {email} = req.body
        User.findOne({
            where: {
                email:email
            }
        }).then(user =>{
            if(!user) {
                res.status(404).json({msg:"User not found"})
            }else {
                let token = jwt.sign({user: user}, authConfig.secret, { 
                    expiresIn: authConfig.expires,
                });
                res.json({
                    user: user,
                    token: token
                })
            }
        })

    },

    signUp (req, res){

        // en el caso que registremos usuarios locales usariamos bcrypt para encriptar

        //let password = bcript.hashSinc(req.body.password, authConfig.rounds)
      
        User.create({
            given_name: req.body.given_name,
            family_name: req.body.family_name,
            nickname: req.body.nickname,
            email: req.body.email,
            picture: req.body.picture
        }).then(user => {
            let token = jwt.sign({user: user}, authConfig.secret, { 
                expiresIn: authConfig.expires,
            });
            res.json({
                user: user,
                token: token
            })
        }).catch(err => {
            res.status(500).json(err)
        })
    }
}