import Todo from '#models/todo'
import type { HttpContext } from '@adonisjs/core/http'

export default class TodoController {

  async index({ auth, response }: HttpContext) {
    const todos = await Todo.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', 'desc')
    return response.ok(todos)
  }

  // async create({ request, response, auth }: HttpContext) {
  //   const payload = request.all()
  //   const todo = await Todo
  //     .create({
  //       ...payload,
  //       userId: auth.user!.id
  //     })
  //   return response.created({ todo, msg: 'created' })
  // }

  async store({ request, auth, response }: HttpContext) {
    const payload = request.all()
    const userId = auth.user?.id
    const todo = await Todo
      .create({
        ...payload,
        userId
      })
    return response.created({ todo, msg: 'created' })
  }

  async show({ params, response, auth }: HttpContext) {
    const todo = await Todo
      .query()
      .where('id', params.id)
      .where('uisaer_id', auth.user!.id)
      .firstOrFail()
    return response.ok({ todo, msg: 'found your todo' })
  }

  // async edit({ params }: HttpContext) { }

  // async update({ params, request }: HttpContext) { }

  async destroy({ params, response, auth }: HttpContext) {
    const todo = await Todo
      .query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .firstOrFail()
    await todo.delete()
    return response.ok({ msg: 'deleted' })
  }
}
