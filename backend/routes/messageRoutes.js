require("dotenv").config()
const express=require("express");
const router=express.Router();
const isLoggedIn=require("../middleware/isLoggedIn")
const messageModel=require("../models/message")
const chatModel=require("../models/chat")


router.post("/:id",isLoggedIn,async(req,res)=>{
    try {
        const userId=req.user.id
        const chatId=req.params.id
        const text=req.body.text
        if(!text){
            return res.json({message:"text is required"})
        }
    
        const chat= await chatModel.findOne({
            _id:chatId,
            users:userId
           })
       
           if(!chat){
               return res.status(404).json({message:"chat not found"})
           }
           const message=await messageModel.create({
             text,
             sender:userId,
             chatId
           })
          
           chat.lastMessage=text
           chat.seenBy=[userId]
           chat.messages.push(message._id)

            await chat.save()
           return res.status(200).json({message})

        
       } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to add message"})
        
       }
   
})



module.exports=router;