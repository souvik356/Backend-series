const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
   fromUserId:{
    type: mongoose.Types.ObjectId,
    required: true
   },
   toUserId:{
    type: mongoose.Types.ObjectId,
    required: true
   },
   status:{
    type: String,
    validate(data){
        if(!["interested","ignore","rejected","accepted"].includes(data)){
            throw new Error("Status is not valid")
        }
    }
   }
},
{
    timestamps: true
})

const ConnectionRequest =  mongoose.model("ConnnectionRequest",connectionSchema)
module.exports = { ConnectionRequest }