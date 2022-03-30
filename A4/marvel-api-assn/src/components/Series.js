import axios from "axios";
import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import loadingAni from '../images/loading.gif';
import FourOFour from "./FourOFour";

const Series = () => {
    const [loading, setLoading] = useState(true);
    const [seriesData, setSeriesData] = useState(undefined);
    const [hasError, setHasError] = useState(false);
    let {id} = useParams();
    console.log(id);
    useEffect(() => {
        async function getSeries() {
            try{
                let url = targetUrl(id);
                let {data} = await axios.get(url);
                if(data.code === 200) {
                    setHasError(false);
                }
                let seriesData = data.data.results[0];
                setSeriesData(seriesData);
            } catch(e) {
                setHasError(true);
            }
            setLoading(false);
        }
        getSeries()
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
                    <img src={`${seriesData.thumbnail.path}.${seriesData.thumbnail.extension}`}
                        alt={seriesData.title} className="rounded-lg overflow-hidden h-[600px]"></img>
                </div>
                <div className="bg-red-300 p-8 m-8 border-2 border-red-600 rounded-lg">
                    <p className="font-thin font-['Raleway'] text-4xl text-gray-800 text-center">{seriesData.title}</p>
                    <p className="mt-2 text-center font-mono"><span className="font-semibold">Type:</span> {seriesData.type}</p>
                    <div className="grid grid-cols-2 gap-5 mx-4">
                        <p className="mt-2 text-center font-mono"><span className="font-semibold">Start Year:</span> {seriesData.startYear}</p>
                        <p className="mt-2 text-center font-mono"><span className="font-semibold">End Year:</span> {seriesData.endYear}</p>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="font-semibold underline">Creators:</p>
                        <div className="grid grid-cols-2 mt-2 text-sm font-mono">
                            {creatorList(seriesData)}
                        </div>
                    </div>
                    {characterList(seriesData)}
                    {comicList(seriesData)}
                </div>
            </div>
        )
    }
}

const comLink = (comics) => {
    let comicList = null;
    if (comics.length > 3) {
        comicList = comics.slice(0,5).map(
            (comic) => {
                let comicId = comic.resourceURI.split('/')[6];
               return (<p><Link to={`/comics/${comicId}`} className="font-mono">{comic.name}</Link></p>)
            }
        )

    } else if(comics.length > 0 && comics.length <=5){
        comicList = comics.map((comic) => {
            let comicId = comic.resourceURI.split('/')[6];
           return (<p><Link to={`/comics/${comicId}`} className="font-mono">{comic.name}</Link></p>)
        } )
    }
    return comicList;
}

const comicList = (series) => {
    if(series.hasOwnProperty("comics") && series.comics.available > 0) {
        // let numberOfComics = series.comics.available;
        return (
            <div className="mx-2 mt-5 text-center">
                <p className="font-semibold underline">Comics:</p>
                <div>
                    {comLink(series.comics.items)}
                    {/* {numberOfComics > 3 ? <p className="font-mono"><Link to={`/series/${series.id}/comics`}>See more</Link></p> : null} */}
                </div>
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
    if (characters.length > 3) {
        charList = characters.slice(0,3).map(
            (character) => {
                let charId = character.resourceURI.split('/')[6];
                return(<p><Link to={`/characters/${charId}`} className="font-mono">{character.name}</Link></p>)
        }
        )

    } else if(characters.length > 0 && characters.length <=5){
        charList = characters.map((character) => {
            let charId = character.resourceURI.split('/')[6];
            return(<p><Link to={`/characters/${charId}`} className="font-mono">{character.name}</Link></p>)
        })
    }
    return charList;
}

const characterList = (series) => {
    if(series.hasOwnProperty("characters") && series.characters.available > 0) {
        // let numberOfCharacters = series.characters.available;
        return (
            <div className="mx-2 mt-5 text-center">
                <p className="font-semibold underline">Characters:</p>
                <div>
                    {charLink(series.characters.items)}
                    {/* {numberOfCharacters > 3 ? <p className="font-mono"><Link to={`/series/${series.id}/characters`}>See more</Link></p> : null} */}
                </div>
            </div>
        )
    }
}


const targetUrl = (seriesId) => {
    const md5 = require('blueimp-md5');
    const baseURL = process.env.REACT_APP_BASE_URL;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    let timestamp = new Date().getTime();
    const stringToHash = timestamp + privateKey + publicKey;
    const hash = md5(stringToHash);
    return baseURL+`/v1/public/series/${seriesId}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
}

export default Series;