const express = require('express')
const { getWhitelist, addToWhitelist, removeFromWhitelist } = require('../../controller/whitelist/whitelistController')
const router = express.Router()

router.post('/whitelist', getWhitelist)
router.post('/addWhitelist', addToWhitelist)
router.delete('/removeWhitelist', removeFromWhitelist)

module.exports = router;