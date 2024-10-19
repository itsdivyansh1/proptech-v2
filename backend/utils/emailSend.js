require("dotenv").config()
const nodemailer=require("nodemailer")

const emailSend=async(email,otp)=>{
    try {
        const transporter=nodemailer.createTransport({
            service:"Gmail",
            auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
            }
        });
    
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:"Email Verification",
            text:`Your OTP is ${otp} . It will Expire in 5 minutes`,
        }
    
    
       let info=await transporter.sendMail(mailOptions)
       console.log("email send:",info.response);
       return "OTP send to your email"
        
    } catch (error) {
        console.log("Failed to send OTP:",error);
        
        return "Failed to send OTP"
        
    }
  

}


module.exports=emailSend;