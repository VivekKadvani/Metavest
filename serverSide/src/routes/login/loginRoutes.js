const express = require('express')
const { getLoginData, addLoginData, verifySignature } = require('../../controller/login/loginController')
const router = express.Router()

router.post('/login', getLoginData)
router.post('/newLogin', addLoginData)
router.post('/authenticate', verifySignature)

// router.delete('/removeWhitelist', removeFromWhitelist)

module.exports = router;