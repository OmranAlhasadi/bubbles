const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
  const mailOptions = {
    to: email,
    from: "throwawayomran@gmail.com",
    subject: "Verify Your Bubbles Account",
    text: `Please verify your email by clicking on the link: ${verificationUrl}. If you did not try to sign up at Bubbles then please ignore this email.`,
    html: `<strong>Please verify your Bubbles email by clicking on the link:</strong> <a href="${verificationUrl}">Verify Email</a>`,
  };

  await sendgridMail.send(mailOptions);
};

module.exports = {
  sendVerificationEmail,
};
