import mail from '@adonisjs/mail/services/main'
import ResetPasswordNotification from '#mails/reset_passaword_notification'
import PasswordResetToken from '#models/password_reset_token'
import User from '#models/user'
import { forgotPasswordValidator, loginValidator, registerValidator, resetPasswordValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import hashService from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export default class AuthController {
  async register({ request }: HttpContext) {
    const { name, email, password, password_confirmation } = await request.validateUsing(registerValidator)
    console.log(password, password_confirmation)
    const user = await User.create({
      name,
      email,
      password,
    })
    const token = await User.accessTokens.create(user)
    return {
      user,
      token: token.value!.release(),
    }
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return {
      user,
      token: token.value!.release(),
    }
  }

  async me({ auth }: HttpContext) {
    const user = await auth.use('api').authenticate()
    return user
  }

  async logout({ auth }: HttpContext) {
    await auth.use('api').authenticate()
    return { message: 'Logged out' }
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    const user = await User.findBy('email', email)
    if (!user) {
      return response.ok({ message: 'If that email exists, a reset link has been sent.' })
    }

    await PasswordResetToken.query().where('user_id', user.id).delete()

    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = await hashService.make(rawToken)

    await PasswordResetToken.create({
      userId: user.id,
      token: hashedToken,
      expiresAt: DateTime.now().plus({ hours: 1 }),
    })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`

    await mail.send(new ResetPasswordNotification(email, resetUrl))

    return response.ok({ message: 'If that email exists, a reset link has been sent.' })
  }

  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)
    const email = request.input('email') as string

    if (!email) {
      return response.badRequest({ message: 'Email is required.' })
    }

    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'Invalid or expired reset link.' })
    }

    const resetToken = await PasswordResetToken.query()
      .where('user_id', user.id)
      .where('expires_at', '>', DateTime.now().toSQL()!)
      .first()

    if (!resetToken) {
      return response.badRequest({ message: 'Invalid or expired reset link.' })
    }

    const isValid = await hashService.verify(resetToken.token, token)
    if (!isValid) {
      return response.badRequest({ message: 'Invalid or expired reset link.' })
    }

    user.password = password
    await user.save()

    await resetToken.delete()

    return response.ok({ message: 'Password reset successfully.' })
  }
}
