
import { Router } from 'express'

import { authorizeRoles, verifyJWT } from '../middleware/auth.middleware.js'
import { changecurrentPassword, getcurrentuser, googleLogin, login, logout, refreshAccessToken, register, searchUserByUsername, updateAccountDetails, updateUserInterests, updateUserRoleBySuperAdmin } from '../controllers/auth.controller.js'

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
router.route('/google-login').post(googleLogin)

// secured routes
router.use(verifyJWT)
router.route('/logout').post(logout)
router.route('/me').get(getcurrentuser)
router.route('/change-password').patch(changecurrentPassword)
router.route('/update-account').patch(updateAccountDetails)
router.route('/update-interests').patch(updateUserInterests)

// superadmin
router.get('/superadmin/search', authorizeRoles('superadmin'), searchUserByUsername);

router.route('/superadmin/:id/role').patch(authorizeRoles('superadmin'),updateUserRoleBySuperAdmin)


export default router