const adminAuth = (req,res,next)=>{
    const token = "xyz"
    const isAuthorized = token === "xyz"
    if(!isAuthorized){
        res.status(401).send('unauthorized access')
    }
    else{
        next()
    }
}

const userAuth =(req,res,next)=>{
    const token = "xyzz"
    const isAuthorized = token === "xyz"
    if(!isAuthorized){
        res.status(401).send('unauthorized access')
    }
    else{
        next()
    }
}

module.exports ={ adminAuth,userAuth }