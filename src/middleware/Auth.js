const jwt = require('jsonwebtoken')
const { User } = require('../models/User')

const userAuth =async(req,res,next)=>{
    try{
        const cookie = req.cookies
        const {token} = cookie
        if(!token){
            throw new Error("invalid token please login")
        }
         const decodeMessage = await jwt.verify(token,'Devtinder@123')
         const {_id} = decodeMessage
         const user = await User.findById(_id)
         if(!user){
            throw new Error('no user found')
         }
         req.info = user
         next()
    }catch(err){
        res.status(400).send(err.message)
    }
}

module.exports ={ userAuth }