const userModel=require("../models/user");

const deleteUnverified=async()=>{
    try {

    let deletedusers=await userModel.deleteMany({
        isVerified:false,
        otpExpires:{$lt:Date.now()}
        
    })

    console.log(`${deletedusers.deletedCount} unverified users have deleted.`);
    
        
    } catch (error) {
        console.log("error deleting unverified",error.message);
        
    }

    
}


module.exports=deleteUnverified