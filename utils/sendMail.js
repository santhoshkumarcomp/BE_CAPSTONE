const nodemailer = require("nodemailer");
const { EMAIL_ID, EMAIL_PASS } = require("./config");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_ID,
    pass: EMAIL_PASS,
  },
});
const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: EMAIL_ID,
    to,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent to" + info.response);
    }
  });
};

module.exports = sendMail;
