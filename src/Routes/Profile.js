const express = require('express')
const { userAuth} = require('../middleware/Auth')
const { User } = require('../models/User')
const profileRouter = express.Router()
const bcrypt = require('bcrypt')
const validator = require('validator')


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

profileRouter.patch('/profile/forgetPassword',userAuth,async(req,res)=>{
    try{
        const passKey = req.body
     const {oldPassword,newPassword} = passKey
    const loggedInUser = req.info
    console.log(loggedInUser);
    const hashPassword = loggedInUser.password
    const isOldPasswordValid = await bcrypt.compare(oldPassword,hashPassword)
    if(!isOldPasswordValid){
        throw new Error("password is incorrect")
    }else{
        const isNewPasswordValid = await validator.isStrongPassword(newPassword)
        if(!isNewPasswordValid){
            throw new Error("Password is not strong")
        }else{
            const newHashPassword = await bcrypt.hash(newPassword,10)
            console.log(newHashPassword);
            const user = await User.findByIdAndUpdate({"_id":loggedInUser._id},{"password":newHashPassword})
            console.log(user);
            res.send(`${loggedInUser.firstName}, your password is updated successfully`)
        }
    }
    }catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
    }
     
})

module.exports ={ profileRouter }