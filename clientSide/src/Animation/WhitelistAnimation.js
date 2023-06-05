import React from 'react'
import Whitelist_Animation from '../images/WhitelistANimation.json'
import Lottie from 'react-lottie'

const WhitelistAnimation = () => {
    const defaultOptions = {
        loop: true,
        speed: '2x',
        autoplay: true,
        animationData: Whitelist_Animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    const style = {
        div_footer: `h-10 bg-pink  mt-auto w-full `
    }
    return (
        <>
            <Lottie options={defaultOptions}
                height={300}
                width={300} />
        </>
    )
}

export default WhitelistAnimation