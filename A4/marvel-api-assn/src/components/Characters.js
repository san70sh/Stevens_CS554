import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";    
import FourOFour from "./FourOFour";
import loadingAni from "../images/loading.gif";
import SearchBox from "./SearchBox";

const Characters = () => {
    const [loading, setLoading] = useState(true);
    const [invalidData, setInvalidData] = useState(false);
    const [searchTerm, setSearchTerm] = useState(undefined);
    const [characterData, setCharacterData] = useState(undefined);
    const [searchData, setSearchData] = useState(undefined);
    const [charOffset, setCharOffset] = useState(0);
    const [charLimit] = useState(20);
    const [charTotal, setCharTotal] = useState(0);
    let charCard = null;
    let {page} = useParams();


    useEffect(() => {
        async function fetchSearchData() {
            let url = null;
            try {
                url = targetUrl(charOffset)+"&nameStartsWith="+searchTerm;
                let {data} = await axios.get(url);
                console.log("Data: "+data);
                setLoading(false);
                setCharOffset(charLimit*(parseInt(page)))
                let searchResults = data.data;
                let {results, total} = searchResults;
                setCharTotal(total);
                setSearchData(results);

            } catch(e) {
                console.log(e);
            }
        }
        if(searchTerm) {
            fetchSearchData();
        }
    }, [searchTerm, charLimit, charOffset, page])

    
    useEffect(() => {
        async function fetchCharacters() {
            let url = null;
            try {
                url = targetUrl(charOffset);
                let {data, code} = await axios.get(url);
                setLoading(false);
                setCharOffset(charLimit*(parseInt(page)));
                let charData = data.data;
                let {results, total} = charData;
                setCharacterData(results);
                setInvalidData(false);
                setCharTotal(total);
                if(code === 404) {
                    setInvalidData(true);
                    setLoading(false);
                }
            } catch (e) {
                console.log(e);
            }
                
        }
        
        // console.log(characterData);
        if(!searchTerm || searchTerm.length === 0) {
            fetchCharacters();
        }
    }, [charLimit, charOffset, page, searchTerm])

    const searchKey = async (value) => {
        setSearchTerm(value);
      };

    if(searchTerm && searchData) {
        charCard = searchData.map((character) => {
            return buildCard(character);
        })
    } else if(!searchTerm && characterData){
        charCard = characterData.map((character) => {
            return buildCard(character);
        })
    }
    if (loading) {
        return (
            <div className="flex justify-center">
                <img src={loadingAni} alt="Avenger Loading Animation" className="w-full h-full"></img>
            </div>
        )
    } else if(invalidData) {
        return(
            <div>
                <FourOFour/>
            </div>
        )
    } else {
        return (
            <div className="mx-5 mb-10">
                <div className="my-5">
                    <SearchBox searchKey = {searchKey} />
                </div>
                <div>
                    <Pagination 
                        elementsPerPage={charLimit}
                        elementOffset = {charOffset}
                        totalElements={charTotal}
                        currentPage={parseInt(page)}
                        api={'/characters/page'}
                        />
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                    {charCard}
                </div>
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
    return(
        <Link to={`/characters/${character.id}`} aria-label={character.name}>
            <div key={character.id} className="rounded-lg overflow-hidden hover:scale-105 space-x-6 transform transition duration-200 bg-red-200 border-red-600 border-2">
                <div>
                    <img
                        src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                        alt={character.name}
                        className="object-center h-full object-cover w-full lg:h-80"
                    />
                </div>
                <div className="my-4 text-center">
                    {character.name}
                </div>
            </div>
        </Link>
    )
}

export default Characters;