const express = require('express')
const { crateVesting, getVesting, getAllVesting } = require('../../controller/newVesting/createVestingController')
const router = express.Router()

router.post('/vesting', getVesting)
router.post('/vestings', getAllVesting)
router.post('/createVesting', crateVesting)

// router.delete('/removeWhitelist', removeFromWhitelist)

module.exports = router;