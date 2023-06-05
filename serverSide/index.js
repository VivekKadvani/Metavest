const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const WhitelistRoutes = require('./src/routes/whitelist/whitelistRoutes')
const vestingRoutes = require('./src/routes/newVesting/createVestingRoutes')
const loginRoutes = require('./src/routes/login/loginRoutes')
const db = require("./models");
const port = 3000

const app = express()
app.use(express.json())
app.use(cors())
// app.use(bodyParser.json())
app.use('/', WhitelistRoutes)
app.use('/', vestingRoutes)
app.use('/', loginRoutes)

// db.sequelize.sync({ alter: true });


app.listen(port, () => {
    console.log("Listening on 3000...");
})
