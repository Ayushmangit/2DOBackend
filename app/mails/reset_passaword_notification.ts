import { BaseMail } from '@adonisjs/mail'

export default class ResetPasswordNotification extends BaseMail {
  subject = 'Reset your password'

  constructor(
    private email: string,
    private resetUrl: string
  ) {
    super()
  }

  prepare() {
    this.message.to(this.email)
    this.message.from(process.env.SMTP_USERNAME!)
    this.message.html(`
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#502f4c;">Password Reset</h2>
        <p>Click the link below to reset your password. It expires in <strong>1 hour</strong>.</p>
        <a href="${this.resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#502f4c;color:#fff;
                  border-radius:6px;text-decoration:none;font-weight:bold;">
          Reset Password
        </a>
        <p style="margin-top:16px;color:#999;font-size:12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `)
  }
}
