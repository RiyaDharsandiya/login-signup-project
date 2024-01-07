const {Router}=require("express")
const router=Router()
const controller=require("../controller/authController")

router.get('/signup',controller.signup_get)
router.post('/signup',controller.signup_post)
router.get('/login',controller.login_get)
router.post('/login',controller.login_post)
router.get('/logout',controller.logout_get)
router.get('/forget_pass',controller.forgot_password)
router.post('/forget_pass',controller.forgot_password_post)
module.exports=router
