
import AuthController from '#controllers/auth_controller'
import TodoController from '#controllers/todo_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.post("/register", [AuthController, 'register'])
  router.post("/login", [AuthController, 'login'])
  router.post("/logout", [AuthController, 'logout'])
  router.get("/me", [AuthController, 'me'])
}).prefix("auth/")

router.group(() => {
  router.get('/', [TodoController, 'index'])
  router.post('/', [TodoController, 'store'])
  router.post('/:id', [TodoController, 'destroy'])
}).prefix("todos/")
  .use(middleware.auth())
