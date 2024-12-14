const mongoose = require('mongoose')

// const userName = "roysantanu729"
// const password = "eEOmGAUT1WGrtBv8"

const connectDb = async ()=>{
   await mongoose.connect('mongodb+srv://roysantanu729:eEOmGAUT1WGrtBv8@devtinder.hh3lq.mongodb.net/Devtinder1')
}

module.exports ={ connectDb }