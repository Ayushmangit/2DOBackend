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
