const express = require('express')
const WhitelistRoutes = require('./src/routes/whitelist/whitelistRoutes')
const vestingRoutes = require('./src/routes/newVesting/createVestingRoutes')
const port = 3000

const app = express()
app.use(express.json())
app.use('/', WhitelistRoutes)
app.use('/', vestingRoutes)

app.listen(port, () => {
    console.log("Listening on 3000...");
})
