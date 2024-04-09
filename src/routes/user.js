const express = require('express')

const { newUserRegistration, verificationCode, emailValidation, checkLogin } = require('../controllers/user')

const router = express.Router()

const { isAuthenticated } = require('../middleware/auth')



router.post('/newUserRegistration' ,newUserRegistration)

router.post('/verificationCode', verificationCode)

router.post('/codeValidation', emailValidation)

router.post('/checkLogin', checkLogin)



module.exports = router


