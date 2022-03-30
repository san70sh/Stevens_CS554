import React, {useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import loadingAni from '../images/loading.gif';
import FourOFour from "./FourOFour";
import SearchBox from "./SearchBox";

const Comics = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(undefined);
    const [comicData, setComicData] = useState(undefined);
    const [searchData, setSearchData] = useState(undefined);
    const [comOffset, setComOffset] = useState(0);
    const [comLimit] = useState(20);
    const [comTotal, setComTotal] = useState(0);
    const [invalidData, setInvalidData] = useState(false);
    let comCard = null;
    let {page, id} = useParams();
    console.log(id);
    useEffect(() => {
        async function fetchSearchData() {
            let url = null;
            try {
                url = targetUrl(comOffset)+"&titleStartsWith="+searchTerm;
                let {data} = await axios.get(url);
                console.log("Data: "+data);
                setLoading(false);
                setComOffset(comLimit*(parseInt(page)))
                let searchResults = data.data;
                let {results, total} = searchResults;
                setComTotal(total);
                setSearchData(results);
                console.log(results);
            } catch(e) {
                console.log(e);
            }
        }
        if(searchTerm) {
            fetchSearchData();
        }
    }, [searchTerm, comLimit, comOffset, page])

    
    useEffect(() => {
        async function fetchComics() {
            try {
                let url = null;
                url = targetUrl(comOffset);
                let {data} = await axios.get(url);
                setLoading(false);
                setComOffset(comLimit*(parseInt(page)));
                let comData = data.data, code = data.code;
                let {results, total} = comData;
                setComicData(results);
                setInvalidData(false);
                console.log(data);
                console.log(results);
                setComTotal(total);
                if(code === 404 || comOffset >= total) {
                    setInvalidData(true);
                    setLoading(false);
                }
            } catch (e) {
                console.log(e);
            }
        }
        if(!searchTerm || searchTerm.length === 0) {
            fetchComics();
        }
    }, [searchTerm, comLimit, comOffset, page])

    const searchKey = async (value) => {
        setSearchTerm(value);
      };

    if(searchTerm && searchData) {
        comCard = searchData.map((comic) => {
            return buildCard(comic);
        })
    } else if(!searchTerm && comicData) {
        comCard = comicData.map((comic) => {
            return buildCard(comic);
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
    }
    else {
        return (
            <div className="mx-5 mb-10">
                <div className="my-5">
                    <SearchBox searchKey = {searchKey} />
                </div>
                <div>
                    <Pagination 
                        elementsPerPage={comLimit}
                        elementOffset = {comOffset}
                        totalElements={comTotal}
                        currentPage={parseInt(page)}
                        api={'/comics/page'}
                        />
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                    {comCard}
                </div>
            </div>
        )
    }
}



const targetUrl = (comicOffset) => {
    const md5 = require('blueimp-md5');
    const baseURL = process.env.REACT_APP_BASE_URL;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    let timestamp = new Date().getTime();
    const stringToHash = timestamp + privateKey + publicKey;
    const hash = md5(stringToHash);
    if(comicOffset === 0) {
        return baseURL+`/v1/public/comics?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
    } else {
        return baseURL+`/v1/public/comics?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&offset=${comicOffset}`;
    }
}

const buildCard = (comic) => {
    console.log('Cards built');
    return(
        <Link to={`/comics/${comic.id}`}>
            <div key={comic.id} className="rounded-lg overflow-hidden hover:scale-105 space-x-6 transform transition duration-200 bg-red-200 border-red-600 border-2">
                <div>
                    <img
                        src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                        alt={comic.title}
                        className="object-center h-full object-cover w-full lg:h-80"
                    />
                </div>
                <div className="my-4 text-center">
                    {comic.title}
                </div>
            </div>
        </Link>
    )
}

export default Comics