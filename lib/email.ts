import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import env from './env'


const resend = new Resend(env.resendApiKey!)

function loadEmailTemplate(username: string, url: string): string {
  const templatePath = path.join(__dirname, '..', 'templates', 'email.html')
  const html = fs.readFileSync(templatePath, 'utf-8')

  return html
    .replace(/{{USERNAME}}/g, username)
    .replace(/{{URL}}/g, url)
}

export async function sendVerificationEmail({
  to,
  username,
  url
}: {
  to: string
  username: string
  url: string
}) {
  const htmlContent = loadEmailTemplate(username, url)

  const response = await resend.emails.send({
    from: 'noreply@donationhub.com',
    to,
    subject: 'Verifikasi Email Anda - Donation Hub',
    html: htmlContent
  })

  return response
}
