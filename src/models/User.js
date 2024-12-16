const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true,
    },
    emailID:{
        type: String,
        required: true,
        unique:  true,
        trim: true,
        validate(value){
           if(!validator.isEmail(value)){
              throw new Error("Email address is not valid")
           }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    photoURL:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('PhotoURL is not valid')
            }
        }
    },
    age:{
        type: Number,
        validate(value){
            if(!(value>18)){
                throw new Error("age is not valid")
            }
        }
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid")
            }
        }
    },
    skills:{
        type: [String],
        validate(value){
            if(value.length>10){
                throw new Error("Skills count must not be more than 10")
            }
        }
    },
    about:{
        type: String,
        minLength: 4,
        maxLength: 100
    }
},
{
    timeStamps: true
})

const User = mongoose.model('User',userSchema)

module.exports ={ User }