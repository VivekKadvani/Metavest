import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ABI from '../ABI/ABI.json'
import { AppContext } from '../App'
import Popup from './Popup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingLock from '../Animation/LandingLock';
const ethers = require("ethers")
const ConfirmLock = ({ data }) => {
    const { whitemod_flag } = useContext(AppContext)
    const [total_duration, setTotalDuration] = useState('')
    const [start_time_f, setStartTimeF] = useState('')
    const [cliff_time_f, setCliffimeF] = useState('')
    const [end_time_f, setEndtimeF] = useState('')
    const [slice_period_f, setSlicePeriodF] = useState('')
    const [tnRunning, setTnRunnig] = useState(false)
    const navigate = useNavigate();

    const style = {
        outer_div: `flex min-h-fit items-center px-24`,
        div_inner: !whitemod_flag ? `h-fit pb-10 w-full bg-grey m-12 rounded-xl  ` : `h-fit pb-10 w-full bg-light_pink m-12 rounded-xl  `,
        title_text: `font-vesting text-pink text-3xl justify-self-start`,
        title_div: `flex m-6`,
        form_div: whitemod_flag ? `m-11 bg-white_text shadow-[rgba(0,_0,_0,_0.24)_0px_0px_5px] rounded-xl` : `m-11 bg-dim_black  shadow-[rgba(0,_0,_0,_0.24)_0px_0px_10px] rounded-xl`,
        input_form_div: `flex justify-center `,
        btn_withdraw: `bg-pink font-vesting rounded-full px-6 h-10 box-border mx-10 mb-6 `,
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
        const duration = calculateDuration(data.Start_timestamp, data.end_timestamp)
        setTotalDuration(duration)
        setStartTimeF(formatTimestamp(data.Start_timestamp))
        setEndtimeF(formatTimestamp(data.end_timestamp))
        setCliffimeF(formatTimestamp(data.cliff_timestamp))
        setSlicePeriodF(calculateDuration(Date.now(), Date.now() + data.slice))
    }, [])
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

    async function ConfirmLock() {
        try {


            const contractAddress = '0xf8d318205eD763959Fb79FF55469C6071Fe061a7';
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const wallet_add = await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);

            const amount = ((data.amount) * (10 ** data.decimalOfToken)).toString();

            let start = (data.Start_timestamp);
            let duration = (data.end_timestamp - data.Start_timestamp);
            let slicePeriod = data.slice;
            let cliff = data.cliff_timestamp;
            let beneficiaries = data.Beneficiaries.toString();
            let addressOfToken = data.address_of_token.toString();



            //approval check
            const tokenContractAddress = addressOfToken;
            let Tokencontract = null;
            if (provider.provider.networkVersion == 80001)
                Tokencontract = await fetch(`https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=6Z536YUCYRCIDW1CR53QAS1PYZ41X2FA7K`)
            else if (provider.provider.networkVersion == 11155111)
                Tokencontract = await fetch(`https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=WSG13CQU7C9GAHQIRH3J51BPRDYDSC835B`)
            const respo = await Tokencontract.json()
            const Tcontract = new ethers.Contract(tokenContractAddress, respo.result, signer);
            const allowance = await Tcontract.allowance(wallet_add[0], contractAddress);
            if (parseInt(allowance) <= amount) {
                const approval = await Tcontract.approve(contractAddress, amount)
                await approval.wait();
            }
            const lock = await contract.lock(amount, start, duration, slicePeriod, cliff, beneficiaries, addressOfToken);

            setTnRunnig(true);
            await lock.wait();
            setTnRunnig(false);
            navigate('/currentVesting');
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
            fireToast('error', msg)
        }


    }

    function CancelLock() {
        navigate('/newVesting');
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
    }
    return (
        <>
            {
                tnRunning
                    ?
                    <LandingLock />
                    :
                    <>
                        <div className={style.form_div}>
                            <div className={style.input_form_div}>
                                <div className={style.input_form_div_left}>
                                    <p className={style.input_label}>Amount</p>
                                    <p className={style.data}>{data.amount}</p>
                                    <p className={style.input_label}>Start Time</p>
                                    <p className={style.data}>{start_time_f}</p>
                                    <p className={style.input_label}>Cliff</p>
                                    <p className={style.data}>{cliff_time_f}</p>
                                    <p className={style.input_label}>End Time</p>
                                    <p className={style.data}>{end_time_f}</p>
                                    <p className={style.input_label}>Slice Period</p>
                                    <p className={style.data}>{slice_period_f}</p>
                                </div>
                                <div className={style.input_form_div_left}>

                                    <p className={style.input_label}>Token</p>
                                    <p className={style.data}>{data.nameOfToken}</p>
                                    <p className={style.input_label}>Address Of Token</p>
                                    <p className={style.data}>{data.address_of_token}</p>
                                    <p className={style.input_label}>Beneficiaries</p>
                                    <p className={style.data}>{data.Beneficiaries}</p>

                                    <p className={style.input_label}>Total Duration</p>
                                    <p className={style.data}>{total_duration}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className={style.btn_withdraw} onClick={CancelLock} >Cancel</button>
                            <button className={style.btn_withdraw} onClick={ConfirmLock} >Confirm</button>
                        </div>
                    </>
            }
        </>

    )
}
export default ConfirmLock