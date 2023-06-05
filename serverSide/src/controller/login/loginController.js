const { login } = require('../../../models')
const ethers = require('ethers')

const getLoginData = async (req, res) => {
    try {
        const { address } = req.body;
        const data = await login.findOne({
            where: { address: address }
        });
        res.status(200).json(data)
    }
    catch (e) {
        res.status(400).json(e)
    }
}

const addLoginData = async (req, res) => {
    try {
        const { address, nounce } = req.body
        const data = await login.create({
            address, nounce
        })
        res.status(200).json(data)
    }
    catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
}

const verifySignature = async (req, res) => {
    try {

        let { signature, message, address } = req.body;
        console.log("here....");
        let recoveredaddress = ethers.utils.verifyMessage(message, signature);
        if (recoveredaddress.toLowerCase() == address.toLowerCase())
            res.status(200).json({ status: true })
        //generate jwt token
        else
            res.status(200).json({ status: false })
    }
    catch (e) {
        console.log(e);
        res.status(400).json(e)
    }
}
module.exports = {
    getLoginData,
    addLoginData,
    verifySignature
}