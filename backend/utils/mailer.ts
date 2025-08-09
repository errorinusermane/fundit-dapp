import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // 465면 true, 그 외는 false
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USERNAME,
    pass: process.env.SMTP_PASS || process.env.GMAIL_PASSWORD,
  },
});

export async function sendMagicLink(email: string, magicLink: string) {
  const mailOptions = {
    from: `"Fundit 팀" <${process.env.SMTP_USER || process.env.GMAIL_USERNAME}>`,
    to: email,
    subject: "🔐 [Fundit] 로그인 링크가 도착했어요!",
    html: `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body, html { margin: 0; padding: 0; background-color: #000; font-family: 'Segoe UI', sans-serif; color: #e5e7eb; }
            .container { max-width: 480px; margin: auto; background-color: #0A0A0A; padding: 32px; border-radius: 16px; text-align: center; }
            h1 { color: #14EAFF; }
            .button { display: inline-block; margin-top: 24px; padding: 14px 32px; background: linear-gradient(to right, #14EAFF, #1D4ED8); color: white; text-decoration: none; border-radius: 32px; font-weight: bold; }
            .footer { margin-top: 36px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔐 Magic Link</h1>
            <p>Fundit에 오신 걸 환영합니다 ✨</p>
            <p>아래 버튼을 클릭하여 로그인하세요:</p>
            <a href="${magicLink}" class="button">지금 로그인하기</a>
            <div class="footer">
              ⏳ 이 링크는 일정 시간이 지나면 만료됩니다.<br/>
              🧾 Powered by <strong>Fundit</strong> | © ${new Date().getFullYear()}
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
