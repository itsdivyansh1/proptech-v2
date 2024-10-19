require("dotenv").config()
const express=require("express");
const router=express.Router();
const isLoggedIn=require("../middleware/isLoggedIn")
const userModel=require("../models/user");
const passwordHash = require("../utils/passHash");
const postModel = require("../models/post");
const savedPostModel=require("../models/savedPost")

router.get("/getallusers",async(req,res)=>{
    try {
        const users=await userModel.find()
        if(!users){
            return res.json({message:"No users Found"})
        }
        
        return res.status(200).json({users})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to get users"})
        
    }

})

router.get("/getuser/:id",isLoggedIn,async(req,res)=>{
    const {id}=req.params

    try {
        const user= await userModel.findOne({_id:id})
        if(!user){
            return res.json({message:"user not found"})
        }
        return res.json({user})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to get user"})
        
    }
    
})


router.put("/updateuser/:id",isLoggedIn,async(req,res)=>{
 const {id}=req.params;
 const {username,password,avatar}=req.body
  if(id!==req.user.id){
    return res.status(401).json({message:"Not authorized"})
  }


try {
    const user= await userModel.findOne({_id:id})
   
 if(!user){
     return res.json({message:"user not found"})
 }
  if(username){
    user.username=username
  }
  if(avatar){
    user.avatar=avatar
  }
  if(password){
 const hashPassword= await passwordHash(password)
 user.password=hashPassword
  }
 

await user.save()

return res.json({message:"updated"})

    
} catch (error) {
    
}


    
})


router.delete("/deleteuser/:id",isLoggedIn,async(req,res)=>{
  const {id}=req.params

    if(id!==req.user.id){
        return res.json({message:"Not authorized"})
      }

    try {
        const user= await fndByIdAndDelete({_id:id})
        return res.json({message:"user deleted"})
        

        
    } catch (error) {
        
    }
    
    
})


router.get("/profileposts",isLoggedIn,async(req,res)=>{
const userId=req.user.id

try {
  const posts=await postModel.find({userId})
  
  const savedPosts= await savedPostModel.find({userId}).populate("postId")

  const userPosts = {
    posts: posts.length > 0 ? posts : [],      
    savedPosts: savedPosts.length > 0 ? savedPosts : [] 
  };


  return res.status(200).json({ userPosts});
  
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Failed to fetch user's posts" });
}

})












module.exports=router