const nodemailer = require("nodemailer");
const { sendEmailCode, PassResetConfirmation } = require("./useHTML");

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kunalkhandekar010@gmail.com",
    pass: "otapadlwmycauxgo",
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

async function sendForgotEmail(email, name, code) {
  try {
    await mailer.sendMail({
      from: "kunalkhandekar010@gmail.com",
      to: email,
      subject: "Reset Password - TalkAtive",
      html: sendEmailCode(name, code),
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function sendPassResetConfirmationEmail(email, name) {
  await mailer.sendMail({
    from: "kunalkhandekar010@gmail.com",
    to: email,
    subject: "Password Changed Successfully - TalkAtive",
    html: PassResetConfirmation(name),
  });
}

module.exports = {
  sendForgotEmail,
  sendPassResetConfirmationEmail,
};
