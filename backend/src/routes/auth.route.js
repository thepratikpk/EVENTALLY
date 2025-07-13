
import { Router } from 'express'

import { verifyJWT } from '../middleware/auth.middleware.js'
import { changecurrentPassword, getcurrentuser, login, logout, refreshAccessToken, register, updateAccountDetails, updateUserInterests } from '../controllers/auth.controller.js'

const router =Router()
//OLD
// router.post('/register',register)
// router.post('/login',login)
// router.post("/logout", logout);
// router.get("/check", protectRoute, checkAuth);

// NEW

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/refresh-token').post(refreshAccessToken)

// secured routes
router.use(verifyJWT)
router.route('/logout').post(logout)
router.route('/me').get(getcurrentuser)
router.route('/change-password').patch(changecurrentPassword)
router.route('/update-account').patch(updateAccountDetails)
router.route('/update-interests').patch(updateUserInterests)


export default router