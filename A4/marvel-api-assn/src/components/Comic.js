import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import loadingAni from "../images/loading.gif";
import FourOFour from "./FourOFour";
const Comic = () => {
    const [loading, setLoading] = useState(true);
    const [comicData, setComicData] = useState(undefined);
    const [hasError, setHasError] = useState(false);
    const regex = /(<([^>]+)>)/gi;
    let {id} = useParams();

    useEffect(() => {
        async function getComics() {
            try{
                let url = targetUrl(id);
                let {data} = await axios.get(url);
                if(data.code === 200) {
                    setHasError(false);
                }
                let comData = data.data.results[0];
                setComicData(comData);
            } catch(e) {
                setHasError(true);
            }
            setLoading(false);
        }
        getComics()
    }, [id])

    if(hasError) {
        return (
            <div>
                <FourOFour/>
            </div>
        )
    }
    if (loading) {
        return (
            <div className="flex justify-center">
                <img src={loadingAni} alt="Avenger Loading Animation" className="w-full h-full"></img>
            </div>
        )
    } else {
        return(
            <div className="grid grid-cols-2 gap-10 m-10">
                <div className="p-8 flex justify-center">
                    <img src={`${comicData.thumbnail.path}.${comicData.thumbnail.extension}`}
                        alt={comicData.title} className="rounded-lg overflow-hidden h-[600px]"></img>
                </div>
                <div className="bg-red-300 p-8 m-8 border-2 border-red-600 rounded-lg">
                    <p className="font-thin font-['Raleway'] text-4xl text-gray-800 text-center">{comicData.title}</p>
                    {comicData.textObjects.length > 0 ? <p className="pt-6 mx-5 text-center text-sm"><>{comicData.textObjects[0].text.replace(regex, '').substring(0, 350) + '...'}</></p> : null}
                    
                    {comicData.creators.available > 0 ? <div className="mt-2 text-center">
                        <p className="font-semibold underline">Creators:</p>
                        {creatorList(comicData)}
                    </div> : null}
                    {characterList(comicData)}
                    {series(comicData)}
                </div>
            </div>
        )
    }
}

const series = (comic) => {
    if (comic.hasOwnProperty("series")) {
        return (
            <div className="mx-2 mt-5 text-center font-mono">
                <p className="font-semibold underline">Series: </p> 
                <p><Link to={`/series/${comic.series.resourceURI.split('/')[6]}`} className="font-thin">{comic.series.name}</Link></p>      
            </div>
        )
    }
}

const creatorList = (comic) => {
    let creators = comic.creators.items.map((creator) => <p><span className="font-semibold font-mono">{creator.role}</span> - <span>{creator.name}</span></p>);
    return creators;
}

const charLink = (characters) => {
    let charList = null;
    if (characters.length > 5) {
        charList = characters.slice(0,5).map(
            (character) => {
                let charId = character.resourceURI.split('/')[6];
                return(<p><Link to={`/characters/${charId}`} className="font-thin">{character.name}</Link></p>)
        }
        )

    } else if(characters.length > 0 && characters.length <=5){
        charList = characters.map((character) => {
            let charId = character.resourceURI.split('/')[6];
            return(<p><Link to={`/characters/${charId}`} className="font-thin">{character.name}</Link></p>)
        })
    }
    return charList;
}

const characterList = (comic) => {
    if(comic.hasOwnProperty("characters") && comic.characters.available > 0) {
        // let numberOfCharacters = comic.characters.available;
        return (
            <div className="mx-2 mt-5 text-center">
                <p className="font-semibold underline">Characters:</p>
                <div>
                    {charLink(comic.characters.items)}
                    {/* {numberOfCharacters > 3 ? <p className="font-thin"><Link to={`/comics/${comic.id}/characters`}>See more</Link></p> : null} */}
                </div>
            </div>
        )
    }
}


const targetUrl = (comicId) => {
    const md5 = require('blueimp-md5');
    const baseURL = process.env.REACT_APP_BASE_URL;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    let timestamp = new Date().getTime();
    const stringToHash = timestamp + privateKey + publicKey;
    const hash = md5(stringToHash);
    return baseURL+`/v1/public/comics/${comicId}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
}


export default Comic;