import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Pagination from "./Pagination";


const Characters = () => {
    const [loading, setLoading] = useState(true);
    // const [searchTerm, setSearchTerm] = useState(undefined);
    const [characterData, setCharacterData] = useState(undefined);
    // const [searchData, setSearchData] = useState(undefined);
    const [charOffset, setCharOffset] = useState(0);
    const [charLimit] = useState(20);
    const [charTotal, setCharTotal] = useState(0);
    let charCard = null;
    let {page} = useParams();
    useEffect(() => {
        async function fetchCharacters() {
            let url = null;
            try {
                url = targetUrl(charOffset);
                let {data} = await axios.get(url);
                setLoading(false);
                setCharOffset(charLimit*(parseInt(page)));
                let charData = data.data, code = data.code;
                let {results, total} = charData;
                setCharTotal(total);
                if(code === 404) {
                    return null;
                } else {
                    setCharacterData(results);
                }
            } catch (e) {
                console.log(e);
            }

        }
        fetchCharacters();
    }, [charLimit, charOffset, page])

    if(characterData) {
        charCard = characterData.map((character) => {
            return buildCard(character);
        })
    }
    if (loading) {
        return (
            <div>
                <p>loading...</p>
            </div>
        )
    } else {
        return (
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {charCard}
                <Pagination 
                    charactersPerPage={charLimit}
                    characterOffset = {charOffset}
                    totalCharacters={charTotal}
                    currentPage={parseInt(page)}
                />
            </div>
        )
    }
}

const targetUrl = (characterOffset) => {
    const md5 = require('blueimp-md5');
    const baseURL = process.env.REACT_APP_BASE_URL;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    let timestamp = new Date().getTime();
    const stringToHash = timestamp + privateKey + publicKey;
    const hash = md5(stringToHash);
    if(characterOffset === 0) {
        return baseURL+`/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
    } else {
        return baseURL+`/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&offset=${characterOffset}`;
    }
}

const buildCard = (character) => {
    console.log('Cards built');
    return(
        <div key={character.id}>
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                    alt={character.name}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <p>{character.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Characters;