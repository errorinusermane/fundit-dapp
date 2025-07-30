import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // .env에서 GMAIL_USER, GMAIL_APP_PASSWORD 불러오기

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendMagicLink(email: string, magicLink: string) {
  const mailOptions = {
    from: `"Fundit 로그인" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "🔐 Fundit 로그인 링크",
    html: `
      <p>아래 버튼을 클릭하여 Fundit에 로그인하세요:</p>
      <a href="${magicLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">로그인하기</a>
      <p>또는 이 링크를 브라우저에 붙여넣기: <br /> <code>${magicLink}</code></p>
      <p>이 링크는 일정 시간이 지나면 만료될 수 있습니다.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Magic link sent: ", info.response);
  } catch (err) {
    console.error("❌ Failed to send magic link:", err);
    throw err;
  }
}
