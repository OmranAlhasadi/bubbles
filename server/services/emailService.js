const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendVerificationEmail = async (email, token) => {
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

exports.sendPasswordResetEmail = async (email, url) => {
  const mailOptions = {
    to: email,
    from: "throwawayomran@gmail.com",
    subject: "Password Reset for Bubbles",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${url}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  await sendgridMail.send(mailOptions);
};
