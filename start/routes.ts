
import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'

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
