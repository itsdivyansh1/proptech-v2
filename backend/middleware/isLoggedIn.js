const jwt=require("jsonwebtoken")


const isLoggedIn=(req,res,next)=>{
    const token=req.cookies.authToken
    try {
        if(!token){
            return res.json({message:"Please login first",login:false})
        }
        let data=jwt.verify(token,process.env.JWT_SECRET)
        req.user=data
        next()
    } catch (error) {
        console.log(error.message);
        return res.json({message:"Invalid or Expired token"})
        
    }
    
}

module.exports=isLoggedIn