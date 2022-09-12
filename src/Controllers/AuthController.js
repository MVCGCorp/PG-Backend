
const jwt = require('jsonwebtoken');
const authConfig = require('./Auth')
const {  User } = require("../db.js");
const userRouter = require("../routes/user")


module.exports = {
    signIn (req, res){

        const {email} = req.body
        User.findOne({
            where: {
                email:email
            }
        }).then(user =>{
            if(!user) {
                res.status(404).json({msg:"User not found"})
            }else {
                const token = jwt.sign({user: user}, authConfig.secret, { 
                    expiresIn: authConfig.expires,
                });
                res.json({
                    user: user,
                    token: token
                })
            }
        })

    },

    async signUp (req, res){
            const {
              given_name,
              family_name,
              email,
              rol
            } = req.body;
            if (!given_name || !family_name || !email) {
              return res.status(400).send("Some data is missing");
            }
            try {
              let userSaved = await User.findOrCreate({
                where: {
                  given_name: given_name,
                  family_name: family_name,
                  email: email,
                  rol: rol || 'user'
                },
              });
              let token = jwt.sign({user: userSaved}, authConfig.secret, { 
                expiresIn: authConfig.expires,
            });
              return res.status(200).json({
                user: userSaved,
                token: token
            });
            } catch (error) {
              console.log(error);
              res.status(400).send(error);
            }
          
        // en el caso que registremos usuarios locales usariamos bcrypt para encriptar

        //let password = bcript.hashSinc(req.body.password, authConfig.rounds)
    //     console.log(req.body.given_name)
    //     User.create({
    //         given_name: req.body.given_name,
    //         family_name: req.body.family_name,
    //         nickname: req.body.nickname,
    //         email: req.body.email,
    //         picture: req.body.picture
    //     })
    //     .then(user => {
    //         let token = jwt.sign({user: user}, authConfig.secret, { 
    //             expiresIn: authConfig.expires,
    //         });
    //         res.json({
    //             user: user,
    //             token: token
    //         })
    //     }).catch(err => {
    //         console.log(err)
    //         res.status(500).json(err)
    //     })
    // }
}}