import React, { useContext, useEffect } from 'react'
import { json, NavLink } from "react-router-dom"
import lock_logo from '../images/lock_logo.png'
import dark_mode from '../images/dark-theme.svg'
import { useState } from 'react'
import { AppContext } from '../App'
import { ethers } from 'ethers'


const HeaderMain = () => {
    const { WalletConnection, setWalletConnection } = useContext(AppContext)
    const { whitemod_flag, setWhitemodflag } = useContext(AppContext);
    const [l_value, setLabel] = useState('Connect')
    const [Flag, setFlag] = useState(0);


    async function connectWallet() {
        try {


            const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
            const start = acc[0].substring(0, 6);
            const end = acc[0].substring(acc[0].length - 4);
            const Short_acc = `${start}...${end}`
            localStorage.setItem("WalletAddress", Short_acc)
            setWalletConnection(true);
            setLabel(Short_acc)
            localStorage.setItem("MetamaskConnection", "true")

            //db action 

            //check for address is in table or not ; null or object
            const checkLoginDetail = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json ;charset=utf-8' },
                body: JSON.stringify({ address: acc[0] })
            })
            const loginStatus = await checkLoginDetail.json()
            console.log(loginStatus);

            if (loginStatus == null) {
                console.log("in null part");
                try {
                    const acc = await window.ethereum.request({ method: "eth_requestAccounts" });

                    //generate random number
                    const randomNumber = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

                    //add address and random number as nounce in databse 
                    const createlogin = await fetch("http://localhost:3000/newLogin", {
                        headers: { 'Content-Type': 'application/json ;charset=utf-8' },
                        // mode: 'no-cors',
                        method: "POST",
                        body: JSON.stringify({ address: acc[0], nounce: randomNumber }),
                    })

                    //GET inserted data as response
                    const createdUserData = await createlogin.json();

                    //make msg object and sign it with metamask
                    const message = JSON.stringify({ address: createdUserData.address, nounce: createdUserData.nounce })
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const signature = await signer.signMessage(message)

                    //send signature to backend and verify user
                    const authenticate = await fetch("http://localhost:3000/authenticate", {
                        headers: { 'Content-Type': 'application/json ;charset=utf-8' },
                        method: "POST",
                        body: JSON.stringify({ address: acc[0], signature: signature, message: message }),
                    })

                    const status = await authenticate.json()

                }
                catch (e) {
                    console.log(e);
                }
            }

            else {
                console.log("in not null part");
                try {
                    const acc = await window.ethereum.request({ method: "eth_requestAccounts" });

                    //get user address and nounce from backend
                    const userDetail = await fetch("http://localhost:3000/login", {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json ;charset=utf-8' },
                        body: JSON.stringify({ address: acc[0] })
                    })
                    const userDetailObject = await userDetail.json()
                    const { address, nounce } = userDetailObject
                    console.log("new data", address, nounce)

                    //sign message drom frontend using metamask 
                    const message = JSON.stringify({ address: acc[0], nounce: nounce })
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const signature = await signer.signMessage(message)

                    //authenticate user signature by sending it to backend
                    const authenticate = await fetch("http://localhost:3000/authenticate", {
                        headers: { 'Content-Type': 'application/json ;charset=utf-8' },
                        // mode: 'no-cors',
                        method: "POST",
                        body: JSON.stringify({ address: acc[0], signature: signature, message: message }),
                    })

                    const status = await authenticate.json()
                    console.log(status);
                }
                catch (e) {
                    console.log(e)
                }

            }
        }
        catch (error) {
            setLabel("Connect")
        }
    };
    //set label on connect 
    useEffect(() => {

        (localStorage.getItem("MetamaskConnection") == "true") ? connectWallet() : setLabel("Connect")
    }, [Flag])
    window.addEventListener('load', () => {
        setFlag(Flag + 1);
    });

    //set label on disconnect
    window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length == 0) {
            setLabel("Connect")
            setFlag(Flag + 1)
            setWalletConnection(false)
            localStorage.setItem("MetamaskConnection", "false")

        }
        else {
            setLabel(accounts[0])
            setWalletConnection(true)
            setFlag(Flag + 1)
        }
    })

    const style = {
        header: `bg-pink box-border h-12 flex justify-left inset-0 z-11  items-center`,
        logo: ' justify-left items-center box-border h-10 mx-6',
        dark_mode_logo: `flex justify-end items-center box-border h-6  mr-8`,
        wallet_connect: `font-vesting items-center rounded-full bg-dim_black h-8 mr-8 px-4 ml-auto text-white_text`,
        nav_link: `font-vesting mr-10`,
        nav_link_active: `text-white_text font-vesting mr-10`
    }

    const navLinkStyles = ({ isActive }) => {
        return {
            'color': isActive ? `#D9D9D9` : '#1A1A1D',
            'font-family': `'Bruno Ace SC', 'Georgia, Cambria', 'Times New Roman', 'Times', 'serif'`,
            'margin-left': '15px',
            'margin-right': '15px'
        }
    }

    const whitemod = () => {
        whitemod_flag ? setWhitemodflag(false) : setWhitemodflag(true);
        const bgColor = document.body.style.backgroundColor;
        if (bgColor.toString() == "rgb(255, 255, 255)") {
            document.body.style = "background-color:#1A1A1D"//Black
        }
        else
            document.body.style = "background-color:#ffffff;"//white
    }

    return (
        <div className={style.header}>
            <img className={style.logo} src={lock_logo} alt="logo" />
            <div>
                {WalletConnection ? <>
                    <NavLink to={'/home'} style={navLinkStyles} >Home</NavLink>
                    <NavLink to={'/newVesting'} style={navLinkStyles} >New Vesting</NavLink>
                    <NavLink to={'/currentVesting'} style={navLinkStyles} >Current Vesting</NavLink>
                    <NavLink to={'/whitelist'} style={navLinkStyles} >Whitelist</NavLink>
                </>
                    : <></>}
            </div>
            <button className={style.wallet_connect} onClick={connectWallet}>{l_value}</button>
            <img src={dark_mode} className={style.dark_mode_logo} onClick={whitemod} alt="mode" />
        </div>
    )
}

export default HeaderMain 