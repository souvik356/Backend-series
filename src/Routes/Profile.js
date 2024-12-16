const express = require('express')
const { userAuth} = require('../middleware/Auth')
const { User } = require('../models/User')
const profileRouter = express.Router()


profileRouter.get('/profile/view',userAuth,async(req,res)=>{
    try{
    const loggedInUser = req.info
    res.send(loggedInUser)
}catch(err){
    res.status(400).send(err.message)
}
})

profileRouter.patch('/profile/edit',userAuth,async (req,res) => {
    try{
        const data = req.body
        const loggedInUserInfo = req.info
        const ALLOWED_UPDATES = ["skills","photoURL","age","gender","about","firstName","lastName"]
        const isValidUpdate = Object.keys(data).every(k=> ALLOWED_UPDATES.includes(k))
        if(!isValidUpdate){
            throw new Error("update not possible")
        }
        const user = await User.findByIdAndUpdate({"_id": loggedInUserInfo._id},data,{
            runValidators: true
        },{
            returnDocument: "after"
        })
        res.json({
            message: `${loggedInUserInfo.firstName}, your profile is update succesfully`,
            data: loggedInUserInfo
        })
    }catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

module.exports ={ profileRouter }