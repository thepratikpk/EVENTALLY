
import { Router } from 'express'

import { verifyJWT } from '../middleware/auth.middleware.js'
import { login, logout, register } from '../controllers/auth.controller.js'

const router =Router()
//OLD
// router.post('/register',register)
// router.post('/login',login)
// router.post("/logout", logout);
// router.get("/check", protectRoute, checkAuth);

// NEW

router.route('/register').post(register)
router.route('/login').post(login)

// secured routes
router.route('/logout').post(verifyJWT,logout)


export default router