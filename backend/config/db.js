require('dotenv').config();
const mongoose=require("mongoose")
const connection=process.env.CONNECTION;
mongoose.connect(connection).then(()=>{
    console.log("connection successfull");
    
}).catch((err)=>{
    console.log("connection not successfull:",err);
    
})

module.exports=mongoose;