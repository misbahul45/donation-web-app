import { Resend } from 'resend'
import env from './env'

const htmlTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verifikasi Email - Donation Hub</title>
  <style>
    :root {
      --primary-color: #2563eb;
      --primary-color-hover: #1d4ed8;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f4ff;
      padding: 0;
      margin: 0;
    }
    .container {
      max-width: 480px;
      margin: 40px auto;
      padding: 30px;
      background-color: #ffffff;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .logo {
      font-size: 26px;
      color: var(--primary-color);
      font-weight: bold;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
    }
    .button {
      background-color: var(--primary-color);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      display: inline-block;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
    }
    .token-box {
      margin-top: 20px;
      padding: 10px;
      background-color: #f1f5f9;
      border: 1px dashed #94a3b8;
      color: #1e293b;
      font-family: monospace;
      border-radius: 6px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Donation Hub</div>
    <div class="message">
      Halo <strong>{{USERNAME}}</strong>,<br />
      Klik tombol di bawah ini untuk memverifikasi email Anda:
    </div>
    <a href="{{URL}}" class="button">Verifikasi Email</a>
    <div class="message">
      Atau gunakan token berikut ini:
    </div>
    <div class="token-box">{{TOKEN}}</div>
    <div class="footer">
      Jika Anda tidak merasa mendaftar di Donation Hub, abaikan pesan ini.
    </div>
  </div>
</body>
</html>
`

export async function sendVerificationEmail({
  to,
  username,
  url,
  token
}: {
  to: string
  username: string
  url: string
  token: string
}) {
  const resend = new Resend(env.resendApiKey)

  const htmlContent = htmlTemplate
    .replace(/{{USERNAME}}/g, username)
    .replace(/{{URL}}/g, url)
    .replace(/{{TOKEN}}/g, token)

  const response = await resend.emails.send({
    from: 'Donation Hub <onboarding@resend.dev>',
    to,
    subject: 'Verifikasi Email Anda - Donation Hub',
    html: htmlContent
  })

  return response
}
