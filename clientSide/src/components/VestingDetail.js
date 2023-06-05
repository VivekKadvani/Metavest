// import React, { useState, createContext, useContext, useEffect } from 'react'
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ABI from '../ABI/ABI.json'
import { AppContext } from '../App'
import Popup from './Popup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingLock from '../Animation/LandingLock';

const ethers = require("ethers")
const VestingDetail = () => {
    const contractAddress = '0xf8d318205eD763959Fb79FF55469C6071Fe061a7';
    const { WalletConnection, setWalletConnection } = useContext(AppContext)
    const [decimal, setDecimal] = useState()

    const { whitemod_flag } = useContext(AppContext)
    const { vestingId } = useParams();
    const [withdraw_btn_disable, setDisable] = useState(true)
    const [calculate_btn_disable, setDisableC] = useState(false)
    const [data, setVestingData] = useState()
    const [loading, setLoading] = useState(false)
    const [withdrawable, setWithdrawableToken] = useState(0)
    const [Flag, setFlag] = useState(0);
    const [statusOfVesting, setVestingStatus] = useState(false)

    const style = {
        outer_div: `flex min-h-fit items-center px-24`,
        div_inner: !whitemod_flag ? `h-fit pb-10 w-full bg-grey m-12 rounded-xl  ` : `h-fit pb-10 w-full bg-light_pink m-12 rounded-xl  `,
        title_text: `font-vesting text-pink text-3xl justify-self-start`,
        title_div: `flex m-6`,
        form_div: whitemod_flag ? `m-11 bg-white_text shadow-[rgba(0,_0,_0,_0.24)_0px_0px_5px] rounded-xl` : `m-11 bg-dim_black  shadow-[rgba(0,_0,_0,_0.24)_0px_0px_10px] rounded-xl`,
        input_form_div: `flex justify-center `,
        btn_withdraw: withdraw_btn_disable ? `bg-pink opacity-25 font-vesting rounded-full px-6 h-10 box-border mx-10  ` : `bg-pink font-vesting rounded-full px-6 h-10 box-border mx-10  `,
        btn_calculate: calculate_btn_disable ? `bg-pink opacity-25 font-vesting rounded-full px-6 h-10 box-border mx-10  ` : `bg-pink font-vesting rounded-full px-6 h-10 box-border mx-10  `,
        input_field: `bg-white_text rounded font-form mb-10 w-full h-8 p-2`,
        input_label: whitemod_flag ? `font-form text-dim_black justify-self-start mt-4 text-xl` : `font-form text-white justify-self-start mt-4 text-xl`,
        input_label_green: `font-form text-green justify-self-start mt-4 text-xl`,
        input_form_div_left: `mb-0 pb-0 mt-4 pt-0 flex flex-col items-start rounded-xl m-9 p-11 w-full`,
        network_div: `rounded-xl bg-white_text h-12 w-full mx-9 flex items-center pl-4`,
        cmp_network: `px-11`,
        networkLogo: `h-8 px-4`,
        network_name: `font-form pl-2`,
        data: whitemod_flag ? `text-dim_black pb-4` : `text-white_text pb-4`,
        data_green: `text-green pb-4`
    }

    useEffect(() => {
        const getVestingData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const wallet_add = await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);
            const tempschedule = await contract.vestings(wallet_add[0], vestingId);


            const status = (Number(await contract.getTime()) > (Number(((await contract.vestings(wallet_add[0], vestingId)).params).start))) && (Number(await contract.getTime()) < (Number(await contract.getTime()) + (Number(((await contract.vestings(wallet_add[0], vestingId)).params).duration))))
            setVestingStatus(status)
            setVestingData(tempschedule)
            getDecimal(tempschedule.params.TokenAddress)
            if (tempschedule.locked) {
                // setDisable(false)
                setDisableC(false)
            }
            else {
                setDisableC(true)
                setDisable(true);
                setVestingStatus(false)
            }
        }
        getVestingData()

    }, [Flag])
    async function getDecimal(tokenContractAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet_add = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        let Tokencontract = null;
        if (provider.provider.networkVersion == 80001)
            Tokencontract = await fetch(`https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=6Z536YUCYRCIDW1CR53QAS1PYZ41X2FA7K`)
        else if (provider.provider.networkVersion == 11155111)
            Tokencontract = await fetch(`https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=WSG13CQU7C9GAHQIRH3J51BPRDYDSC835B`)
        const respo = await Tokencontract.json()
        const Tcontract = new ethers.Contract(tokenContractAddress, respo.result, signer);
        const decimal = await Tcontract.decimals();
        setDecimal(parseInt(decimal))



    }
    const calculate_withdrawable = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        const withdrawable = await contract.calculate_available_withdraw_token(vestingId);
        setWithdrawableToken(parseInt(withdrawable));
        if (parseInt(withdrawable) == 0) {
            setDisable(true)
            fireToast('warn', 'Not enough amount for withdraw')
        }
        else
            setDisable(false)
    }

    const withdraw = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);
            const tx = await contract.withdraw(vestingId);
            setLoading(true)
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
        }
        catch (e) {
            function extractReasonFromErrorMessage(error) {

                if (error && error.message) {
                    const errorMessage = error.message;
                    const startIndex = errorMessage.indexOf('"');
                    if (startIndex !== -1) {
                        const endIndex = errorMessage.indexOf('"', startIndex + 1);
                        if (endIndex !== -1) {
                            return errorMessage.substring(startIndex, endIndex + 1);
                        }
                    }
                }
                return null;
            }

            let msg = extractReasonFromErrorMessage(e)
            fireToast('error', e.message)
        }

    }
    function formatTimestamp(unixTimestamp) {
        const currentTimestamp = Date.now(); // Current timestamp in milliseconds
        const targetTimestamp = unixTimestamp * 1000; // Convert Unix timestamp to milliseconds

        const resultTimestamp = currentTimestamp + targetTimestamp;
        const dateObject = new Date(resultTimestamp);

        const day = String(dateObject.getDate()).padStart(2, '0');
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const year = String(dateObject.getFullYear());
        const hours = String(dateObject.getHours()).padStart(2, '0');
        const minutes = String(dateObject.getMinutes()).padStart(2, '0');
        const seconds = String(dateObject.getSeconds()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        return `${formattedDate} ${formattedTime}`;
    }
    function calculateDuration(startTimestamp, endTimestamp) {
        const start = new Date(startTimestamp * 1000); // Convert to milliseconds
        const end = new Date(endTimestamp * 1000); // Convert to milliseconds

        const durationInMilliseconds = end - start;

        // Calculate individual units (days, hours, minutes, seconds)
        const seconds = Math.floor(durationInMilliseconds / 1000) % 60;
        const minutes = Math.floor(durationInMilliseconds / 1000 / 60) % 60;
        const hours = Math.floor(durationInMilliseconds / 1000 / 60 / 60) % 24;
        const days = Math.floor(durationInMilliseconds / 1000 / 60 / 60 / 24);

        // Format the duration as a string
        const formattedDuration = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

        return formattedDuration;
    }
    function convertUnixTimestampToDateTime(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const dateTimeFormat = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

        return dateTimeFormat;
    }
    function convertSeconds(seconds) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        seconds %= 24 * 60 * 60;

        const hours = Math.floor(seconds / (60 * 60));
        seconds %= 60 * 60;

        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        let result = '';

        if (days > 0) {
            result += days + (days === 1 ? ' day ' : ' days ');
        }

        if (hours > 0) {
            result += hours + (hours === 1 ? ' hour ' : ' hours ');
        }

        if (minutes > 0) {
            result += minutes + (minutes === 1 ? ' minute ' : ' minutes ');
        }

        if (seconds > 0 || result === '') {
            result += seconds + (seconds === 1 ? ' second ' : ' seconds ');
        }

        return result.trim();
    }

    window.addEventListener('load', () => {
        setFlag(Flag + 1);
    });

    window.ethereum.on("accountsChanged", (accounts) => {
        setFlag(Flag + 1)
        if (accounts.length === 0) {
            setWalletConnection(false)
        }
    })
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

    return (
        <div className={style.outer_div}>
            {WalletConnection
                ?
                (loading
                    ?
                    <LandingLock />
                    :
                    <div className={style.div_inner}>
                        <div className={style.title_div}>
                            <p className={style.title_text}>Vesting Detail</p>
                        </div>
                        <div className={style.form_div}>
                            {data &&
                                <div className={style.input_form_div}>
                                    <div className={style.input_form_div_left}>
                                        <p className={style.input_label}>Amount</p>
                                        <p className={style.data}>{(parseInt(data.params.amount)) / (10 ** decimal)}</p>
                                        <p className={style.input_label}>Start Time</p>
                                        <p className={style.data}>{convertUnixTimestampToDateTime(parseInt(data.params.start))}</p>
                                        <p className={style.input_label}>End Time</p>
                                        <p className={style.data}>{convertUnixTimestampToDateTime(parseInt(parseInt(data.params.start) + parseInt(data.params.duration)))}</p>


                                        <p className={style.input_label}>Duration</p>
                                        <p className={style.data}>{calculateDuration(parseInt(data.params.start), parseInt(parseInt(data.params.start) + parseInt(data.params.duration)))}</p>
                                        <p className={style.input_label}>Beneficiaries</p>
                                        <p className={style.data}>{data.params.beneficiaries}</p>
                                        <p className={style.input_label}>Address Of Token</p>
                                        <p className={style.data}>{data.params.TokenAddress}</p>


                                    </div>
                                    <div className={style.input_form_div_left}>
                                        <p className={style.input_label}>Claimed</p>
                                        <p className={style.data}>{Number(data.claimed) / (10 ** decimal)}</p>
                                        <p className={style.input_label}>Locked</p>
                                        <p className={style.data}>{statusOfVesting ? "Active" : "Unactive"}</p>
                                        <p className={style.input_label}>Cliff</p>
                                        <p className={style.data}>{convertUnixTimestampToDateTime(parseInt(parseInt(data.params.start) + parseInt(data.params.cliff)))}</p>
                                        <p className={style.input_label}>Slice Period</p>
                                        <p className={style.data}>{convertSeconds(parseInt(data.params.slice_period))}</p>
                                        <p className={style.input_label}>Recive on Interval</p>
                                        <p className={style.data}>{parseInt(data.params.recive_on_interval) / (10 ** decimal)}</p>
                                        <p className={style.input_label_green}>Withdrawable</p>
                                        <p className={style.data_green}>{withdrawable / (10 ** decimal)}</p>
                                    </div>
                                </div>}


                        </div>
                        <div>
                            <button className={style.btn_calculate} disabled={calculate_btn_disable} onClick={calculate_withdrawable}>Calculate</button>
                            <button className={style.btn_withdraw} disabled={withdraw_btn_disable} onClick={withdraw}>Withdraw</button>
                        </div>
                    </div>
                )
                :
                <Popup />
            }
        </div>
    )
}

export default VestingDetail