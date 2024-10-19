const mongoose=require("../config/db")

const messageSchema=mongoose.Schema({
text:{
  type:String
},
sender:{
    type :mongoose.Schema.Types.ObjectId,
        ref:"user"
  
},

chatId:
    { type:mongoose.Schema.Types.ObjectId,
        ref:"chat"
      }

},{timestamps:true});

const messageModel=mongoose.model("message",messageSchema);

module.exports=messageModel;