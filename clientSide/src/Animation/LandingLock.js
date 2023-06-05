import React from 'react'
import landing_Lock from '../images/landingLock.json'
import Lottie from 'react-lottie'

const LandingLock = () => {
    const defaultOptions = {
        loop: true,
        speed: '2x',
        autoplay: true,
        animationData: landing_Lock,
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
                height={400}
                width={400} />
        </>
    )
}

export default LandingLock