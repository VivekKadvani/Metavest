import React, { useContext, useState } from 'react'
import { AppContext } from '../App'
import { NavLink } from "react-router-dom"
import Popup from './Popup'
import VestingAnimation from '../Animation/VestingAnimation'
import CurrentVestingAnimation from '../Animation/CurrentVestingAnimation'
import WhitelistAnimation from '../Animation/WhitelistAnimation'

const NewVesting = () => {

    const { whitemod_flag } = useContext(AppContext)
    const { WalletConnection } = useContext(AppContext)

    const style = {
        outer_div: ` min-h-fit items-center `,
        div_inner: whitemod_flag ? `bg-light_pink shadow-[rgba(0,_0,_0,_0.24)_0px_0px_5px] m-12  grid justify-items-center rounded-2xl hover:drop-shadow-3xl ` : `bg-grey m-12 grid h-40h justify-items-center rounded-2xl hover:drop-shadow-3xl `,
        div_inr_text: `font-vesting mt-6 text-3xl  text-pink`,
        img_div: `rounded-2xl flex justify-items-center m-4  p-12 h-fit w-8/12`,
        img_div_v: `rounded-2xl grid justify-items-center m-4 p-12 h-fit w-7/12 `,
        onlyImage: ``,
        alert_popup: `text-pink bg-grey h-48 w-96`
    }

    return (
        <div className={style.outer_div} >
            {WalletConnection
                ?
                <div className='h-fit w-full grid grid-cols-2 justify-c'>
                    <div className='flex justify-center'>
                        <NavLink to={'/lockToken'} className={style.div_inner}>
                            <p className={style.div_inr_text}>New Vesting</p>
                            <div className={style.img_div} >
                                <VestingAnimation />
                            </div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to={'/currentVesting'} className={style.div_inner}>
                            <p className={style.div_inr_text}>Current Vesting</p>
                            <div className={style.img_div_v} >
                                <CurrentVestingAnimation />
                            </div>
                        </NavLink>
                    </div>
                    {/* <NavLink to={'/whitelist'} className={style.div_inner}>
                        <p className={style.div_inr_text}>Whitelist</p>
                        <div className={style.img_div} >
                            <WhitelistAnimation />
                        </div>
                    </NavLink> */}
                </div>
                :
                <Popup />
            }
        </div >
    )
}

export default NewVesting