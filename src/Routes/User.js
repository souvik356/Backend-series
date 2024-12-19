const express = require('express')
const { userAuth } = require('../middleware/Auth')
const { ConnectionRequest } = require('../models/ConnectRequest')
const userRouter = express.Router()

userRouter.get('/user/requests',userAuth,async (req,res)=>{
    const loggedInUser = req.info
    try{
        const connectionRequest = await ConnectionRequest.find({
             toUserId: loggedInUser._id,
            status: 'interested'
            })
            .populate("fromUserId",["firstName","lastName","photoURL"])
        res.json({
            message:"All your request are below",
            data: connectionRequest
        })

    }catch(err){
        res.status(400).json({ message:`Something went wrong ${err.message}`})
    }
})

userRouter.get('/user/connections',userAuth,async(req,res)=>{
  const loggedInUser = req.info
  console.log(loggedInUser);
  
  try{
     const connectionRequest = await ConnectionRequest.find({
        $or:[
            { fromUserId: loggedInUser._id,status:'accepted'},
            { toUserId: loggedInUser._id,status:'accepted'}
        ]
     })
     .populate("fromUserId",["firstName","lastName"])
     .populate("toUserId",["firstName","lastName"])
     console.log(connectionRequest);

     const data = connectionRequest.map((row)=>{
        if(row.fromUserId._id.equals(loggedInUser._id)){
            return row.toUserId
        }
        return row.fromUserId
     })

     res.json({data})

  }catch(err){
    res.status(400).send(`ERROR : ${err.message}`)
  }

})

userRouter.get('/user/feed',userAuth,(req,res)=>{
   try{
     const loggedInUser = req.info
     
     // user should see all cards EXCEPT :-
      // - his own card
      // - his connections
      // - ignored people
      // - already sent the connection request
      
   }catch(err){
      res.status(400).send(`ERROR : ${err.message}`)
   }
})

module.exports = { userRouter }