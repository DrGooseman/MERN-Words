const express = require("express");
const router = express.Router();

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASSWORD
  }
});

const mailOptions = {
  from: process.env.MY_EMAIL,
  to: process.env.MY_EMAIL,
  subject: "TopWords Message from ",
  text: ""
};

router.post("/", async (req, res) => {

  const newMailOptions = { ...mailOptions };
  newMailOptions.subject += req.body.email;
  newMailOptions.text += req.body.message;
  newMailOptions.text += "   From: " + req.body.email;

  transporter.sendMail(newMailOptions, function(error, info) {
    if (error) {
      return res
        .status(500)
        .send({ message: "Server error, could not send the message." });
    } else {
      res.json({ message: "Email sent!" });
    }
  });
});

module.exports = router;
