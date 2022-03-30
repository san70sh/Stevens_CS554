import React from "react";
import { Link } from "react-router-dom";
import '../App.css';
const Home = () => {
    return(
        <div className="bg-red-900">
            <header className='app-body'>
                <div className="place-content-center bg-red-700 text-white">
                    <div className="flex flex-col items-center py-2">
                        <Link to={"/"} aria-label="Home">
                            <span className="icon--svg icon--svg mvl-animated-logo" aria-hidden="true">
                                <svg width="130" height="52" xmlns="http://www.w3.org/2000/svg">
                                    <rect fill="#EC1D24" width="100%" height="100%"></rect>
                                    <path fill="#FEFEFE" d="M126.222 40.059v7.906H111.58V4h7.885v36.059h6.757zm-62.564-14.5c-.61.294-1.248.44-1.87.442v-14.14h.04c.622-.005 5.264.184 5.264 6.993 0 3.559-1.58 5.804-3.434 6.705zM40.55 34.24l2.183-18.799 2.265 18.799H40.55zm69.655-22.215V4.007H87.879l-3.675 26.779-3.63-26.78h-8.052l.901 7.15c-.928-1.832-4.224-7.15-11.48-7.15-.047-.002-8.06 0-8.06 0l-.031 39.032-5.868-39.031-10.545-.005-6.072 40.44.002-40.435H21.278L17.64 26.724 14.096 4.006H4v43.966h7.95V26.78l3.618 21.192h4.226l3.565-21.192v21.192h15.327l.928-6.762h6.17l.927 6.762 15.047.008h.01v-.008h.02V33.702l1.845-.27 3.817 14.55h7.784l-.002-.01h.022l-5.011-17.048c2.538-1.88 5.406-6.644 4.643-11.203v-.002C74.894 19.777 79.615 48 79.615 48l9.256-.027 6.327-39.85v39.85h15.007v-7.908h-7.124v-10.08h7.124v-8.03h-7.124v-9.931h7.124z"></path>
                                    <path fill="#EC1D24" d="M0 0h30v52H0z"></path>
                                    <path fill="#FEFEFE" d="M31.5 48V4H21.291l-3.64 22.735L14.102 4H4v44h8V26.792L15.577 48h4.229l3.568-21.208V48z"></path>
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>
            </header>
                <div className="mt-40 mx-60 text-center text-white font-mono">
                    <p>This is a single page application of a library storing details of all the comics, series and characters currently present in the Marvel Database.
                        You can access and read about the backstories of Black Panther, Captain America, Dr. Strange, as well as discover several other variants of 
                        these characters and their drastically different origins. The multiverse is <strong>INSANELY</strong> vast, so what's stopping you?
                    </p>
                    <p className="mt-10">You can get to different categories through the links below.</p>
                </div>
                <div className="grid grid-cols-3 gap-0 mx-5 mt-20 pb-80">
                    <div className="flex justify-center">
                        <Link to={'/characters/page/0'}><button className="p-5 duration-500 hover:duration-500 font-mono bg-red-900 hover:bg-red-600 tracking-wider text-white border-2 border-slate-400 rounded-lg">CHARACTERS</button></Link>
                    </div>
                    <div className="flex justify-center">
                        <Link to={'/comics/page/0'}><button className="p-5 font-mono duration-500 hover:duration-500 bg-red-900 hover:bg-red-600 tracking-wider text-white border-2 border-slate-400 rounded-lg">Comics</button></Link>
                    </div>
                    <div className="flex justify-center">
                        <Link to={'/series/page/0'}><button className="p-5 font-mono duration-500 hover:duration-500 bg-red-900 hover:bg-red-600 tracking-wider text-white border-2 border-slate-400 rounded-lg">Series</button></Link>
                    </div>
                </div>
        </div>
    )
}

export default Home