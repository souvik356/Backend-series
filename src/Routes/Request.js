const express = require('express')
const { userAuth } = require('../middleware/Auth')
const requestRouter = express.Router()
const { ConnectionRequest } = require('../models/ConnectRequest')
const { User } = require('../models/User')

requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    const status = req.params.status
    const toUserId = req.params.toUserId
    const fromUserId = req.info._id
    // console.log(toUserId);
    // console.log(fromUserId);
    
    //status :-ignored/interested
    try{
        //  need to validate status
        if(!["interested","ignored"].includes(status)){
            return res.status(400).json({
                message : "Invalid status"
            })
        }

        // need to validate userId if present in database or not
        const toUser = await User.findById({'_id': toUserId})
        // console.log(toUser);
        if(!toUser){
            return res.status(404).json({
                message: "User is invalid"
            })
        }

        //need to check if other party already sent me connection request or not
        const existingConnection = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId}, // it will check if the request is already present or not
                {fromUserId: toUserId,toUserId : fromUserId} // it will check vice verca
            ]
        })
        if(existingConnection){
            return res.status(404).json(
               { message: "connection request already exist"}
            )
        }
        
        const fromUser = await User.findById(fromUserId)
        const toUserr = await User.findOne({"_id": toUserId})
        // console.log(fromUser);
        // console.log(toUserr);
        if(fromUser._id.equals(toUserr._id)){
            return res.status(404).json({ message: "you can't send connection request to yourself"})
        }

        //same user can't send request to himself
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await connectionRequest.save()
        res.json({
        message: `${req.info.firstName} sent connection request to ${toUser.firstName}`,
        data : connectionRequest
       })
    }
    catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
   const loggedInUser = req.info
   const { status,requestId } = req.params
   
   // checking my status
   if(!["accepted","rejected"].includes(status)){
       return res.status(404).json({ message:"Invalid status"})
   }

   // accepting the request and storing it in DB
   const connectionRequest = await ConnectionRequest.findOne({
       _id: requestId,
       toUserId: loggedInUser._id,
       status: 'interested'
   })
   if(!connectionRequest){
    return res.status(404).json({
        message: "connection not found"
    })
   }
   connectionRequest.status = status
   const data = await connectionRequest.save()
   res.json({
    message: `Connection request is ${status}`,
    data
   })
})

module.exports ={ requestRouter }