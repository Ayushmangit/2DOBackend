import vine from '@vinejs/vine'

export const registerValidator = vine.compile(vine.object({
  name: vine.string().minLength(3).maxLength(50),
  email: vine.string().email(),
  password: vine.string().minLength(8).confirmed(),
  password_confirmation: vine.string()
}))

export const loginValidator = vine.compile(vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(8)
}))

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    password: vine.string().minLength(8),
    password_confirmation: vine.string().confirmed({ confirmationField: 'password' }),
  })
)
