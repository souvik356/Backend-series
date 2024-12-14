const express = require('express')
const { connectDb } = require('./utils/Database')
const { User } = require('./models/User')
const { validateData } = require('./utils/Validate')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())
app.use(cookieParser())

// adding data to database using post method
app.post('/signup',async(req,res)=>{
    const data = req.body
    console.log(data);
    try{
       validateData(data)
       const {firstName,lastName,emailID,password,gender,age,photoURL} = data

       const hashPassword = await bcrypt.hash(password,10)
    //    console.log(hashPassword);
       const user = new User({
        firstName,
        lastName,
        emailID,
        password : hashPassword,
       })
       await user.save()
       res.send('Data saved successfully to database')
    }catch(err){
        res.status(400).send(`ERROR :- ${err.message}`)
    }
})

// login API for my Application
app.post('/login',async(req,res)=>{
    const data = req.body
    const {emailID,password} = data
    try{
      const user = await User.findOne({"emailID":emailID})
      if(!user){
        throw new Error("Invalid credential")
      }
      const isPasswordValid = await bcrypt.compare(password,user.password)
      if(isPasswordValid){
       // create a jwt token
        const token = jwt.sign({_id:user._id},"Devtinder@123") // here in jwt token we can store some data and can store secret key here
       // Add  jwt token  in cookie and send the response back to user
    //    console.log(token);
       
       res.cookie("token",token)
      }
      else{
        throw new Error("Password is not valid")
      }
      res.send("Logged in successful")
    }catch(err){
       res.status(400).send(err.message)
    }
})

// profile API 

app.get('/profile',async(req,res)=>{
    try{
    const cookie = req.cookies
//    console.log(cookie);
   const{ token } = cookie
   if(!token){
    throw new Error("Please login")
   }
   const decodeMessage = await jwt.verify(token,'Devtinder@123')
//    console.log(decodeMessage);
   const{_id} = decodeMessage
//    console.log(_id);
   const user = await User.findById({_id})
   if(!user){
    throw new Error('User not found')
   }
   res.send(user)
}catch(err){
    res.status(400).send(err.message)
}
})


// updating user's data using userId
app.patch('/user/:userId',async(req,res)=>{
    const userId = req.params.userId
    const data = req.body
    try{
        const ALLOWED_UPDATES =["firstName","lastName","photoURL","age","gender","password","_id","skills","about"]
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed){
            throw new Error('update not allowed')
        }
        await User.findByIdAndUpdate({_id:userId},data,{
            runValidators: "true"
        })
        res.send("user data updated successfully")
    }catch(err){
      res.status(400).send(`something went wrong ${err}`)
    }
})

// updating user's data using userId
app.patch('/userByEmailId',async(req,res)=>{
   const email = req.body.emailID
   const data = req.body
   try{
    await User.findOneAndUpdate({"emailID":email},data)
    res.send('user data updated successfully')
   }catch(err){
    res.status(400).send(`something went wrong ${err}`)
   }
})

// getting users data using GET method
app.get('/feed',async(req,res)=>{
    try{
        const data = await User.find({})
        res.send(data)
    }catch(err){
        res.status(400).send('something went wrong',err)
    }
})

//getting user details with the help of email
app.get('/userByEmailId',async(req,res)=>{
    const email = req.body.emailID
    console.log(email);
    try{
        const user = await User.find({"emailID":email}).exec()
        if(user.length ===0){
       res.status(400).send("user not found")
        }else{
           res.send(user)
        }
    }catch(err){
       res.status(400).send(`something went wrong ${err}`)
    }
})

// getting user details by ID
app.get('/userByID',async(req,res)=>{
   const userId = req.body._id
    console.log(userId);
    try{
        const user = await User.findById({"_id": userId}).exec()
        console.log(user);
        if(user.length ===0){
            res.status(400).send("user not found")
             }else{
                res.send(user)
             }
    }catch(err){
        res.status(400).send(`something went wrong ${err}`)
    }
})

// deleting user details using UserId
app.delete('/deleteUser',async(req,res)=>{
    const userId = req.body._id
    try{
        await User.findByIdAndDelete({"_id": userId})
        res.send('user deleted succesfully')
    }catch(err){
        res.status(400).send(`something went wrong could not delete ${err}`)
    }
})



connectDb().then(()=>{
    console.log("Database conncted succesfully");
    app.listen(7777,()=>{
        console.log('server is running on port number 7777');
    })
}).catch((err)=>{
   console.error(`Database is not connected succesfully ${err}`);
})