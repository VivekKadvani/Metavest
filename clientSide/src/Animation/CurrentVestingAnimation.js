import React from 'react'
import currentVesting from '../images/CurrentVesting.json'
import Lottie from 'react-lottie'
const CurrentVestingAnimation = () => {
    const defaultOptions = {
        loop: true,
        speed: '2x',
        autoplay: true,
        animationData: currentVesting,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <>
            <Lottie options={defaultOptions}

            />
        </>
    )
}

export default CurrentVestingAnimation