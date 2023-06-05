import React from 'react'
import vesting from '../images/vesting.json'
import Lottie from 'react-lottie'
const VestingAnimation = () => {
    const defaultOptions = {
        loop: true,
        speed: '2x',
        autoplay: true,
        animationData: vesting,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <>
            <Lottie options={defaultOptions} />
        </>
    )
}

export default VestingAnimation