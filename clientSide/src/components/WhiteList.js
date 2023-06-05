import React, { useEffect, useState, useContext } from 'react'
import { Dna } from 'react-loader-spinner'
import ABI from '../ABI/ABI.json'
import Popup from './Popup'
import { AppContext } from '../App'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingLock from '../Animation/LandingLock'
import { fireEvent } from '@testing-library/react'
const ethers = require("ethers")

const WhiteList = () => {
    const owner = "0x36918aF185cC830E225b0726426686a626fA158e"
    const contractAddress = '0xf8d318205eD763959Fb79FF55469C6071Fe061a7';
    const { WalletConnection, setWalletConnection } = useContext(AppContext)
    const { whitemod_flag } = useContext(AppContext)
    const [AdminFlag, setAdminFlag] = useState(false);
    const [whiteListedToken, setData] = useState([])
    const [Flag, setFlag] = useState(0);
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [w_add, setFormData] = useState()

    const style = {
        outer_div: `flex min-h-fit items-center px-24`,
        div_inner: !whitemod_flag ? `h-fit pb-6  w-full bg-grey m-12 rounded-xl` : `h-fit pb-6  w-full bg-light_pink m-12 rounded-xl`,
        title_text: `font-vesting text-pink text-3xl justify-self-start`,
        title_div: `flex m-6`,
        title_data: `grid grid-cols-4 gap-4 mb-2 font-bold font-form bg-pink rounded-xl h-12 items-center mx-10`,
        vesting_data: !whitemod_flag ? `grid grid-cols-4 mt-4 gap-4 text-white bg-dim_black rounded-xl h-10 items-center mx-10` : `grid grid-cols-5 mt-4 gap-4  bg-white_text rounded-xl h-10 items-center mx-10`,
        addWhitelist_div: `flex  items-center mx-10`,
        input_field: `bg-white_text rounded font-form mb-10 w-full h-8 p-2 mr-10`,
        btn_add: `bg-green font-vesting rounded-full px-6 mb-10 h-10 box-border mx-2 `,
        btn_remove: `bg-red font-vesting rounded-full px-6 mb-10 h-10 box-border mx-2 `
    }

    useEffect(() => {
        const getVesting = async () => {
            try {
                setLoading(true)
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const wallet_add = await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, ABI, signer);
                (owner.toLowerCase() === wallet_add[0].toLowerCase()) ? setAdminFlag(true) : setAdminFlag(false)
                const whiteList = [];
                const len_whitelist = parseInt(await contract.getTotalWhitelist());

                for (let i = 0; i < len_whitelist; i++) {
                    const tokenContractAddress = await contract.WhiteListTokens(i)
                    let Tokencontract = null;
                    try {
                        if (provider.provider.networkVersion == 80001)
                            Tokencontract = await fetch(`https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=6Z536YUCYRCIDW1CR53QAS1PYZ41X2FA7K`)
                        else if (provider.provider.networkVersion == 11155111)
                            Tokencontract = await fetch(`https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=WSG13CQU7C9GAHQIRH3J51BPRDYDSC835B`)
                        const respo = await Tokencontract.json()
                        const Tcontract = new ethers.Contract(tokenContractAddress, respo.result, signer);
                        const name = await Tcontract.name()
                        const symbol = await Tcontract.symbol()
                        whiteList.push({ C_address: tokenContractAddress, C_name: `${name} (${symbol})` });
                    }
                    catch (e) {
                        const name = 'not found'
                        const symbol = 'E'
                        whiteList.push({ C_address: tokenContractAddress, C_name: `${name} (${symbol})` });

                    }
                }

                setData(whiteList)
                setLoading(false)
            }
            catch (e) {
                fireToast('error', e)
            }
        }
        getVesting()


    }, [Flag])

    window.addEventListener('load', () => {
        setFlag(Flag + 1);
    });

    window.ethereum.on("accountsChanged", (accounts) => {
        setFlag(Flag + 1)
        if (accounts.length === 0) {
            setWalletConnection(false)
        }
    })

    const addToWhitelist = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);
            const tx = await contract.addWhitelist(w_add)
            setLoading2(true)
            await tx.wait()
            setLoading(false)
            toast.success('Transaction successful', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: whitemod_flag ? "light" : "dark",
            })
            setFlag(Flag + 1)
        }
        catch (e) {
            ((e.toString()).includes('user rejected transaction'))
                ?
                toast.error('User Reject Transaction', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: whitemod_flag ? "light" : "dark",
                })
                :
                console.log(e)//toast
        }
    }
    function fireToast(type, msg) {
        if (type == 'error') {

            toast.error(msg, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: whitemod_flag ? "light" : "dark",
            })
        }
        if (type == 'success') {
            toast.success(msg, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: whitemod_flag ? "light" : "dark",
            })
        }
        if (type == 'warn') {
            toast.warn(msg, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: whitemod_flag ? "light" : "dark",
            });
        }
    }
    const removeFromWhitelist = async () => {
        setLoading(true)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);
            const tx = await contract.removeWhitelist(w_add)
            tx.wait()
            setLoading(false)
            setFlag(Flag + 1)
        }
        catch (e) {
            fireToast('error', e);
        }
    }

    return (
        <div className={style.outer_div}>
            {WalletConnection
                ?
                (loading2
                    ?
                    <LandingLock />
                    :
                    <div className={style.div_inner}>
                        <div className={style.title_div}>
                            <p className={style.title_text}>Whitelisted Token</p>
                        </div>
                        {
                            AdminFlag
                                ?
                                <div className={style.addWhitelist_div}>
                                    <input type='text' className={style.input_field} placeholder="Address of Token" onChange={(event) => { setFormData(event.target.value) }} />
                                    <button className={style.btn_add} onClick={addToWhitelist}>Add</button>
                                    <button className={style.btn_remove} onClick={removeFromWhitelist}>Remove</button>
                                </div>
                                :
                                <> </>
                        }
                        <div className={style.title_data}>
                            <div>Id</div>
                            <div>Name</div>
                            <div class='col-span-2 '>Address</div>

                        </div>
                        {
                            loading
                                ?
                                <div className='flex justify-center'><Dna color="#F20D7B" /></div>
                                :
                                whiteListedToken
                                &&
                                whiteListedToken.map((e, index) => {
                                    return (
                                        <div className={style.vesting_data} key={index}>
                                            <div>{index}</div>
                                            <div>{e.C_name}</div>
                                            <div className='col-span-2 '>{e.C_address}</div>
                                        </div>)
                                })
                        }
                    </div>)
                :
                <Popup />
            }
        </div>
    )
}

export default WhiteList