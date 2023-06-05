const { whitelist, vesting } = require('../../../models')

const crateVesting = async (req, res) => {
    try {
        console.log("try");
        const {
            beneficiary,
            locked,
            starttime,
            cliff,
            slicePeriod,
            endTime,
            networkId,
            tokenId,
            amount,
            recieveOnInterval,
            claimed
        } = req.body;

        const Vesting = await vesting.create({
            beneficiary,
            locked,
            starttime,
            cliff,
            slicePeriod,
            endTime,
            networkId,
            tokenId,
            amount,
            recieveOnInterval,
            claimed
        })
        console.log(Vesting);
        res.status(200).json({ message: "Vesting Created successfully." })
    }
    catch (e) {
        res.json(e)
    }
}

const getVesting = async (req, res) => {
    try {

        const { chain, vestingId, beneficiary } = req.body;

        let vesting_data = await vesting.findOne({
            where: {
                vestingId: vestingId,
                networkId: chain,
                beneficiary: beneficiary
            }
        })
        let token_data = (await vesting_data.getWhitelist()).dataValues
        vesting_data = { ...vesting_data.dataValues, token_data }
        res.status(200).json(vesting_data)
    }
    catch (e) {
        res.json(e)
    }
}

const getAllVesting = async (req, res) => {
    try {

        const { chain, beneficiary } = req.body;

        let vesting_data = await vesting.findAll({
            where: {
                networkId: chain,
                beneficiary: beneficiary
            }
        })
        // let token_data = (await vesting_data.getWhitelist()).dataValues
        // vesting_data = { ...vesting_data.dataValues, token_data }
        res.status(200).json(vesting_data)
    }
    catch (e) {
        res.json(e)
    }
}


module.exports = {
    crateVesting,
    getVesting,
    getAllVesting
}