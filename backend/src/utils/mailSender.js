import nodemailer from "nodemailer";

export async function mailSender(email, otpCode) {
  let user = process.env.SMTP_USER;
  let pass = process.env.SMTP_USER;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    to: email,
    from: `"AI Medical Assistant" <${process.env.SMTP_USER}>}`,
    subject: "Your Password Reset OTP Code",
    html: `<h3>Password Reset Request</h3>
                   <p>Your one-time security verification code is:</p>
                   <h1 style="font-size: 32px; letter-spacing: 4px; color: #2563eb;">${otpCode}</h1>
                   <p>This code will expire in 10 minutes. Do not share this code with anyone.</p>`,
  });
}
