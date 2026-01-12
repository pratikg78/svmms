const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.get("/test-email", async (req, res) => {
  await sendEmail(
    "yourgmail@gmail.com",
    "SVMMS Test Email",
    "Email system is working 🎉"
  );
  res.send("Email sent");
});

module.exports = router;
