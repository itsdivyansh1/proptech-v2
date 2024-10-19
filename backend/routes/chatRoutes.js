require("dotenv").config()
const express=require("express");
const router=express.Router();
const isLoggedIn=require("../middleware/isLoggedIn")
const chatModel=require("../models/chat");
const userModel = require("../models/user");




router.get("/getchats",isLoggedIn,async(req,res)=>{
    try {
    const userId=req.user.id
    const user=await userModel.findById(userId).populate("chats","users messages lastMessage seenBy")
    if(!user){
        return res.status(404).json({message:"user not found"})
    }

    
      
      const chats = await Promise.all(user.chats.map(async chat => {
        const receiverId = chat.users.find(u => u._id.toString() !== userId);
        const receiver= await userModel.findById(receiverId).select("username avatar")
        return {
            ...chat.toObject(),
            receiver: receiver ? { username: receiver.username, avatar: receiver.avatar } : null
        };
      }));
     
      console.log("Chats returned:", chats);

    return res.status(200).json({chats})
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to get chats"})
        
    }

})
   

router.get("/getchat/:id",isLoggedIn,async(req,res)=>{
    try {
    const userId=req.user.id
    const chatId=req.params.id
     
   
    const chat= await chatModel.findOne({
     _id:chatId,
     users:userId
    }).populate("users","username avatar").populate("messages","text sender createdAt")

    if(!chat){
        return res.status(404).json({message:"chat not found"})
    }
    chat.seenBy.push(userId)
    await chat.save()
    
    return res.status(200).json({chat})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to get chat"})
    }
    
})


router.post("/addchat",isLoggedIn,async(req,res)=>{
    try {
        const userId=req.user.id
        const user=await userModel.findById(userId)
        if(!user){
            return res.json({message:"user not found"})
        }

        let existingChat = await chatModel.findOne({
            users: { $all: [userId, req.body.receiverId] }
          });
      
          if (existingChat) {
            return res.status(200).json({ message: "Chat already exists", chat: existingChat });
          }
           
        const newChat=await chatModel.create({
            users:[userId,req.body.receiverId]
        })

        user.chats.push(newChat._id)
        const receiver=await userModel.findById(req.body.receiverId)
        if(receiver){
            receiver.chats.push(newChat._id)
            await receiver.save()
        }
        await user.save()
        console.log(newChat._id);
        return res.status(200).json({newChat})

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to add chat"})
    }
    
})

router.put("/readchat/:id",isLoggedIn,async(req,res)=>{
    try {
        const userId=req.user.id
        const chatId=req.params.id
       const updatechat= await chatModel.findByIdAndUpdate(chatId,{seenBy:userId},{new:true})
       if(!updatechat){
        return res.status(404).json({message:"chat not updated"})
    }

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to read chat"})
    }
    
})


module.exports=router;