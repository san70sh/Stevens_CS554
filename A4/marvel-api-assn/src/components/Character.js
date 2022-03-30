import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import loadingAni from '../images/loading.gif';
import FourOFour from "./FourOFour";

const Character = () => {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [characterData, setCharacterData] = useState(undefined);
    let {id} = useParams();

    useEffect(() => {
        async function getCharacter() {
            try{
                let url = targetUrl(id);
                let {data} = await axios.get(url);
                if(data.code === 200) {
                    setHasError(false);
                }
                let charData = data.data.results[0];
                setCharacterData(charData);
            } catch(e) {
                setHasError(true);
            }
            setLoading(false);
        }
        getCharacter()
    }, [id])
    
    if(hasError) {
        return(
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
    } 
    else {
        return(
            <div className="grid grid-cols-2 gap-10 m-10">
                <div className="p-8 flex justify-center">
                    <img src={`${characterData.thumbnail.path}.${characterData.thumbnail.extension}`}
                        alt={characterData.name} className="rounded-lg overflow-hidden h-[500px] border-4 border-red-300"></img>
                </div>
                <div className="bg-red-300 p-8 m-8 border-2 border-red-600 rounded-lg">
                    <h1 className="font-thin font-['Raleway'] text-4xl text-gray-800 text-center">{characterData.name}</h1>
                    <p className="pt-8 mx-20 text-center">{characterData.description}</p>
                    <div className="grid grid-cols-2 gap-2 mx-4 mt-10 text-center">
                        <div>
                            <h2 className="underline font-semibold">Comics</h2>
                            {comicsList(characterData)}
                        </div>
                        <div>
                            <h2 className="underline font-semibold">Series</h2>
                            {seriesList(characterData)}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

const comicLink = (comics) => {
    let comicList = null;
    if (comics.length > 3) {
        comicList = comics.slice(0,5).map(
            (comic) => {
                let comicId = comic.resourceURI.split('/')[6];
                return(<p><Link to={`/comics/${comicId}`} className="font-thin">{comic.name}</Link></p>)}
        )

    } else if(comics.length > 0 && comics.length <=5){
        comicList = comics.map((comic) => {
            let comicId = comic.resourceURI.split('/')[6];
            return(<p><Link to={`/comics/${comicId}`} className="font-thin">{comic.name}</Link></p>)}
        )
    }
    return comicList;
}

const comicsList = (character) => {
    // let numberOfComics = character.comics.available;
    return (
        <div>
            {comicLink(character.comics.items)}
            {/* {numberOfComics > 3 ? <p className="font-light underline"><Link to={`/characters/${character.id}/comics`}>See more</Link></p> : null} */}
        </div>
    )
}

const seriesLink = (series) => {
    let seriesList = null;
    if (series.length > 5) {
        seriesList = series.slice(0,5).map(
            (s) => {
                let seriesId = s.resourceURI.split('/')[6];
                return(<p><Link to={`/series/${seriesId}`} className="font-thin">{s.name}</Link></p>)}
        )

    } else if(series.length > 0 && series.length <=5){
        seriesList = series.map((s) => {
            let seriesId = s.resourceURI.split('/')[6];
            return(<p><Link to={`/series/${seriesId}`} className="font-thin">{s.name}</Link></p>)}
        )
    }
    return seriesList;
}

const seriesList = (character) => {
    // let numberOfSeries = character.series.available;
    return (
        <div>
            {seriesLink(character.series.items)}
            {/* {numberOfSeries > 3 ? <p className="font-light underline"><Link to={`/characters/${character.id}/series`}>See more</Link></p> : null} */}
        </div>
    )
}

const targetUrl = (characterId) => {
    const md5 = require('blueimp-md5');
    const baseURL = process.env.REACT_APP_BASE_URL;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    let timestamp = new Date().getTime();
    const stringToHash = timestamp + privateKey + publicKey;
    const hash = md5(stringToHash);
    return baseURL+`/v1/public/characters/${characterId}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
}
export default Character;