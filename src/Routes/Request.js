const express = require('express')
const { userAuth } = require('../middleware/Auth')
const requestRouter = express.Router()
const { ConnectionRequest } = require('../models/ConnectRequest')
const { User } = require('../models/User')

requestRouter.post('/request/send/:status/:userId',userAuth,async(req,res)=>{
    const status = req.params.status
    const userId = req.params.userId
    const loggedInUser = req.info
    //status :-ignored/interested
    try{
        //  need to validate status
        if(!["interested","ignored","accepted","rejected"].includes(status)){
            res.status(400).json({
                message : "Invalid status"
            })
        }
        // need to validate userId if present in database or not
        const user = await User.findById(userId)
        console.log(user);
        
        if(!user){
            req.status(400).json({
                message: "User is invalid"
            })
        }
        // need to check if other party already sent me connection request or not

        //same user can't send request to himself
        const connectionRequest = new ConnectionRequest({
            "fromUserId" : loggedInUser._id,
            "toUserId" : userId,
            "status" : status
        })
        await connectionRequest.save()
        res.json({
        message: "connection request is sent",
        data : connectionRequest
       })
    }
    catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

module.exports ={ requestRouter }