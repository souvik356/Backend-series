const express = require('express')
const authRouter = express.Router()
const { validateData } = require('../utils/Validate')
const bcrypt = require('bcrypt')
const { User } = require('../models/User')
const jwt = require('jsonwebtoken')

// adding data to database using post method
 authRouter.post('/signup', async (req, res) => {
   const data = req.body
   console.log(data);
   try {
      validateData(data)
      const { firstName, lastName, emailID, password, gender, age, photoURL } = data

      const hashPassword = await bcrypt.hash(password, 10)
      //    console.log(hashPassword);
      const user = new User({
         firstName,
         lastName,
         emailID,
         password: hashPassword,
      })
      await user.save()
      res.send('Data saved successfully to database')
   } catch (err) {
      res.status(400).send(`ERROR :- ${err.message}`)
   }
})

// login API for my Application
authRouter.post('/login', async (req, res) => {
   const data = req.body
   const { emailID, password } = data
   try {
      const user = await User.findOne({ "emailID": emailID })
      if (!user) {
         throw new Error("Invalid credential")
      }
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (isPasswordValid) {
         // create a jwt token
         const token = jwt.sign({ _id: user._id }, "Devtinder@123", { expiresIn: '1d' }) // here in jwt token we can store some data and can store secret key here
         // Add  jwt token  in cookie and send the response back to user
         //    console.log(token);

         res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
         })
      }
      else {
         throw new Error("Password is not valid")
      }
      res.send("Logged in successful")
   } catch (err) {
      res.status(400).send(err.message)
   }
})

authRouter.post('/logout', (req, res) => {
   res.cookie('token', null, {
      expiresIn: '0h'
   })
   res.send('logout successful')
})

module.exports = { authRouter }