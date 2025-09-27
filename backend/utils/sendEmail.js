const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async (to , message) => {
  try {
    //create transporter
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    });

    //message
    const mailOptions = {
        to,
        subject:"New Message from Tourist Lanka.com",
        html:`<p>${message}</p>`,
    }

    //send the email
   const resInfo = await transporter.sendMail(mailOptions);
   console.log("Message sent:",resInfo.messageId);
   

  } catch (error) {
    console.log(error);
    throw new Error("Email not sent try again later");
    
  }
};

module.exports = sendEmail;