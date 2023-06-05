import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const LandingPage = () => {
    const style = {
        title_landing: ` text-pink font-vesting lg:text-9xl  box-border lg:mt-40 md:text-7xl md:mt-20 z-10`,
        btn_landing: `bg-pink font-vesting rounded-full px-6 h-10 box-border mt-20 z-10`,
        bg_animation: `absolute w-full h-full items-center z-0 mt-12 opacity-10`,
        description: `text-desc text-pink font-vesting   box-border px-96 z-10`
    }

    return (
        <div className={style.cmp_landing}>
            <p className={style.title_landing}>MetaVest <br /></p>
            <p className={style.description}>The Future of Vesting Cryptocurrency Contracts. Experience a revolutionary platform that enables secure
                and automated vesting of your digital assets. With Metavest, you can effortlessly lock, manage, and
                release your cryptocurrency holdings over a designated period, ensuring a fair distribution and
                mitigating risks. .</p>
            <NavLink to="/newVesting" >
                <button className={style.btn_landing}>Get Start</button>
            </NavLink>
        </div>
    )
}

export default LandingPage