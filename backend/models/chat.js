const mongoose=require("../config/db")

const chatSchema=mongoose.Schema({
users:[
   { type:mongoose.Schema.Types.ObjectId,
     ref:"user"
   }
],
messages:[
   { type:mongoose.Schema.Types.ObjectId,
    ref:"message"
   }
],

lastMessage:{
    type:String
},

seenBy:[
    { type:mongoose.Schema.Types.ObjectId,
        ref:"user"
      }
],



},{timestamps:true});

const chatModel=mongoose.model("chat",chatSchema);

module.exports=chatModel;