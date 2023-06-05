import React from 'react'

const Footer = () => {
    const style = {
        footer_div: `bg-pink h-24 mt-auto  w-full`
    }
    return (
        <div className={style.footer_div}>
            <p className='justify-center mt-2 font-form text-2xl'>
                Vesting Contract Powered by @MetaVest
            </p>
            <p className='justify-center mt-2 font-form '>
                Copyright @2022-23
            </p>
        </div>
    )
}

export default Footer
