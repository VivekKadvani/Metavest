import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../App';
import ConfirmLock from './ConfirmLock';

const SetTiming = ({ half_form_send }) => {
    const contractAddress = '0xf8d318205eD763959Fb79FF55469C6071Fe061a7';
    const { whitemod_flag, setWhitemodflag } = useContext(AppContext)
    const { WalletConnection, setWalletConnection } = useContext(AppContext)
    const { page, setPageComponent } = useContext(AppContext)

    const [start_error, setStartError] = useState('')
    const [cliff_error, setCliffError] = useState('')
    const [end_error, setEndError] = useState('')
    const [ConfirmPageFlag, setConfirmPageFlag] = useState(false)

    const [half_form, sethalf_form] = useState({ ...half_form_send })
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false)
    const [whiteListedToken, setData] = useState([])
    const navigate = useNavigate();
    const style = {
        div_inner: whitemod_flag ? `min-h-fit min-w-fit bg-light_pink shadow-[rgba(0,_0,_0,_0.24)_0px_0px_5px] m-12 rounded-xl  ` : `min-h-fit min-w-fit bg-grey m-12 rounded-xl  `,
        title_text: `font-vesting text-pink text-3xl justify-self-start`,
        title_div: `flex m-6 pt-2 mb-0`,
        half_form_div: `m-11 mb-2`,
        input_half_form_div: `flex justify-center min-w-fit `,
        btn_lock: `bg-pink font-vesting rounded-full px-6 mb-10 h-10 box-border  `,
        input_field: whitemod_flag ? `bg-white_text  rounded font-half_form mb-2 w-full h-8 p-2` : `bg-dim_black text-white_text rounded font-half_form mb-2 w-full h-10 p-2`,
        input_field_dd: whitemod_flag ? `  rounded font-half_form mb-2 w-full h-6  relative w-full` : `relative w-full text-white_text rounded font-half_form mb-2 w-full h-6`,
        input_label: whitemod_flag ? `font-half_form text-dim_black justify-self-start mt-2 text-xl` : `font-half_form text-white justify-self-start mt-2 text-xl`,
        input_half_form_div_left: `flex flex-col items-start rounded-xl  p-7 w-full`,
        input_half_form_div_left_child: `flex flex-col items-start rounded-xl  p-7 w-full border-pink border-solid border-2`,
        half_formValidationError: `mb-8 text-red h-6 text-xs text-left`,
    }
    function toTimestamp(timeInput) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const inputTimestamp = new Date(timeInput).getTime() / 1000;
        const totalTimestamp = (inputTimestamp - currentTimestamp);
        return totalTimestamp;
    }
    function validateForm(start_time, end_time, cliff, slice) {
        let strat_error_flag = false
        let start_error_string = '';
        let cliff_error_flag = false
        let cliff_error_string = '';
        let end_error_flag = false
        let end_error_string = '';
        let cmp_slice_flag = false;
        let cmp_slice_err = ''
        if ((start_time) < 0) {
            strat_error_flag = true;
            start_error_string += '-You can not enter Past time. \n'
        }
        if (cliff < 0) {
            cliff_error_flag = true;
            cliff_error_string += "-You can not enter previous time. \n";
        }
        if (cliff > end_time) {
            cliff_error_flag = true;
            cliff_error_string += "-Cliff must be less than end time. \n";
        }
        if (cliff < start_time) {
            cliff_error_flag = true;
            cliff_error_string += "-Cliff must be greater than start time. \n"
        }
        if (end_time < 0) {
            end_error_flag = true;
            end_error_string += "-You can not enter previous time \n";
        }
        if (end_time < start_time) {
            end_error_flag = true;
            end_error_string += "-End time must be greater than start time. \n"
        }
        if (slice > (end_time - start_time)) {
            end_error_flag = true;
            end_error_string += "-end Time must be greater than slice period. \n"
        }
        if (cliff <= start_time) {
            cliff_error_flag = true;
            cliff_error_string += "-cliff Must be greater than start time. \n"
        }
        if (cliff_error_flag) fireToast('error', cliff_error_string);
        if (end_error_flag) fireToast('error', end_error_string);
        if (strat_error_flag) fireToast('error', start_error_string);

        setStartError(start_error_string)
        setCliffError(cliff_error_string)
        setEndError(end_error_string);
        return (!strat_error_flag && !cliff_error_flag && !end_error_flag)
    }
    async function SetupForm() {
        const current_timestamp = Date.now();
        const start_time = toTimestamp(half_form.start_date + 'T' + half_form.start_time);
        const end_time = toTimestamp(half_form.end_date + 'T' + half_form.end_time);
        const cliff = toTimestamp(half_form.cliff_date + 'T' + half_form.cliff_time);
        if (validateForm(start_time, end_time, cliff, half_form_send.slice)) {

            sethalf_form((prevState) => ({
                ...prevState,
                end_timestamp: end_time,
                Start_timestamp: start_time,
                cliff_timestamp: cliff,
            }));
            setConfirmPageFlag(true)
        }
        else {

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
    }

    return (
        <>
            {
                !ConfirmPageFlag
                    ?
                    <>
                        <div className={style.input_half_form_div}>
                            <div className={style.input_half_form_div_left}>
                                <p className={style.input_label}>Start Date</p>
                                <input type="date" className={style.input_field} min={new Date().toISOString().split("T")[0]} onChange={(event) => {
                                    sethalf_form({ ...half_form, start_date: event.target.value })
                                }} />
                                <span className={style.half_formValidationError}>{ }</span>

                                <p className={style.input_label}>Cliff Date</p>
                                <input type="date" className={style.input_field} min={new Date().toISOString().split("T")[0]} onChange={(event) => {
                                    sethalf_form({ ...half_form, cliff_date: event.target.value })
                                }} />
                                <span className={style.half_formValidationError}>{ }</span>

                                <p className={style.input_label}>End Date</p>
                                <input type="date" className={style.input_field} min={new Date().toISOString().split("T")[0]} onChange={(event) => {
                                    sethalf_form({ ...half_form, end_date: event.target.value })
                                }} />
                                <span className={style.half_formValidationError}>{ }</span>
                            </div>

                            <div className={style.input_half_form_div_left}>
                                <p className={style.input_label}>Start Time</p>
                                <input type="time" className={style.input_field} onChange={(event) => {
                                    sethalf_form({ ...half_form, start_time: event.target.value })
                                }} />
                                <span className={style.half_formValidationError}>{start_error}</span>

                                <p className={style.input_label}>Cliff Time</p>
                                <input type="time" className={style.input_field} onChange={(event) => {
                                    sethalf_form({ ...half_form, cliff_time: event.target.value })
                                }} />
                                <span className={style.half_formValidationError}>{cliff_error}</span>

                                <p className={style.input_label}>End Time</p>
                                <input type="time" className={style.input_field} onChange={(event) => {
                                    sethalf_form({ ...half_form, end_time: event.target.value })
                                }} />
                                <span className={style.half_formValidationError}>{end_error}</span>
                            </div>
                        </div>
                        <div>
                            <button className={style.btn_lock} onClick={SetupForm}>Next</button>
                        </div>
                    </>
                    : <ConfirmLock data={half_form} />
            }
        </>
    )
}

export default SetTiming