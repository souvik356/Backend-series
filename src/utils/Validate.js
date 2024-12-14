const validator = require('validator')

const validateData = (data)=>{
   const { firstName,lastName,emailID,password,gender,age,photoURL } = data
   if(!firstName || !lastName){
    throw new Error("First name and last name is not valid")
   }
   else if(!validator.isEmail(emailID)){
     throw new Error("EmailId is not valid")
   }
   else if(!validator.isStrongPassword(password)){
    throw new Error("Please make the password strong")
   }
  //  else if(!["male","female","others"].includes(gender)){
  //   throw new Error("Gender is not valid")
  //  }
  //  else if(!(age >= 18 && age <= 80)){
  //    throw new Error("Age must be greater than 18 and less tham 80")
  //  }
  //  else if(!validator.isURL(photoURL)){
  //   throw new Error("URL is not valid")
  //  }
}
module.exports ={ validateData }