const express = require('express')
const { userAuth } = require('../middleware/Auth')
const requestRouter = express.Router()

requestRouter.post('/sendConnectionRequest',userAuth,(req,res)=>{
    const user = req.info

   res.send(`${user.firstName} sent connection request`)
})

module.exports ={ requestRouter }