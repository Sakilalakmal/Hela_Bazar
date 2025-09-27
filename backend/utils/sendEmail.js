const nodemailer = require("nodemailer");

const sendEmail = async (to, message, subject = "OTP for Hela Bazar Login") => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Always set a "from"
      to,
      subject,
      html: `<p>${message}</p>`,
    };

    const resInfo = await transporter.sendMail(mailOptions);
    console.log("Message sent:", resInfo.messageId);

  } catch (error) {
    console.log(error);
    throw new Error("Email not sent, try again later");
  }
};

module.exports = sendEmail;
