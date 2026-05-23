//sendEamil.js

import { transporter } from "../config/mailer.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Crowdfunding App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (err) {
    console.log("Email error:", err.message);
  }
};