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
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background-color: #000000;
              font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
              color: #e5e7eb;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              height: 100%;
            }
            .wrapper {
              padding: 40px 20px;
              text-align: center;
            }
            .container {
              max-width: 480px;
              margin: 0 auto;
              background-color: #0A0A0A;
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 0 20px rgba(20, 234, 255, 0.12);
            }
            h1 {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 16px;
              color: #14EAFF;
            }
            p {
              font-size: 15px;
              line-height: 1.6;
              color: #cccccc;
              margin: 8px 0;
            }
            .button {
              display: inline-block;
              margin-top: 24px;
              padding: 14px 32px;
              background: linear-gradient(to right, #14EAFF, #1D4ED8);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 32px;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(20, 234, 255, 0.25);
            }
            .footer {
              margin-top: 36px;
              font-size: 12px;
              color: #777777;
            }
          </style>
        </head>
        <body>
          <table>
            <tr>
              <td>
                <div class="wrapper">
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
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
