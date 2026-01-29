import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

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
}
