const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
   fromUserId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User", // it is creating reference with the User Schema/collection
    required:true
   },
   toUserId:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
   },
   status:{
    type: String,
    validate(data){
        if(!["interested","ignored","rejected","accepted"].includes(data)){
            throw new Error("Status is not valid")
        }
    }
   }
},
{
    timestamps: true
})
connectionSchema.index({fromUserId:1,toUserId:1})

const ConnectionRequest =  mongoose.model("ConnnectionRequest",connectionSchema)
module.exports = { ConnectionRequest }