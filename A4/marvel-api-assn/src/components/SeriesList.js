import React, {useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import loadingAni from '../images/loading.gif';
import FourOFour from "./FourOFour";
import SearchBox from "./SearchBox";


const SeriesList = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(undefined);
    const [seriesData, setSeriesData] = useState(undefined);
    const [searchData, setSearchData] = useState(undefined);
    const [seriesOffset, setSeriesOffset] = useState(0);
    const [seriesLimit] = useState(20);
    const [seriesTotal, setSeriesTotal] = useState(0);
    const [invalidData, setInvalidData] = useState(false);
    let seriesCard = null;
    let {page} = useParams();
    
    useEffect(() => {
        async function fetchSearchData() {
            let url = null;
            try {
                url = targetUrl(seriesOffset)+"&titleStartsWith="+searchTerm;
                let {data} = await axios.get(url);
                console.log("Data: "+data);
                setLoading(false);
                setSeriesOffset(seriesLimit*(parseInt(page)))
                let searchResults = data.data;
                let {results, total} = searchResults;
                setSeriesTotal(total);
                setSearchData(results);

            } catch(e) {
                console.log(e);
            }
        }
        if(searchTerm) {
            fetchSearchData();
        }
    }, [searchTerm, seriesLimit, seriesOffset, page])


    useEffect(() => {
        async function fetchSeries() {
            try {
                let url = null;
                url = targetUrl(seriesOffset);
                let {data} = await axios.get(url);
                setLoading(false);
                setSeriesOffset(seriesLimit*(parseInt(page)));
                let comData = data.data, code = data.code;
                let {results, total} = comData;
                setSeriesTotal(total);
                setSeriesData(results);
                setInvalidData(false);
                if(code === 404) {
                    setInvalidData(true);
                    setLoading(false);
                }
            } catch (e) {
                console.log(e);
            }
        }

        if(!searchTerm || searchTerm.length === 0) {
            fetchSeries();
        }
    }, [searchTerm, seriesLimit, seriesOffset, page])

    const searchKey = async (value) => {
        setSearchTerm(value);
      };

    if(searchTerm && searchData) {
        seriesCard = searchData.map((series) => {
            return buildCard(series);
        })
    } else if(!searchTerm && seriesData) {
        seriesCard = seriesData.map((series) => {
            return buildCard(series);
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
                        elementsPerPage={seriesLimit}
                        elementOffset = {seriesOffset}
                        totalElements={seriesTotal}
                        currentPage={parseInt(page)}
                        api={'/series/page'}
                    />

                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                    {seriesCard}
                </div>
            </div>
        )
    }
}



const targetUrl = (SeriesOffset) => {
    const md5 = require('blueimp-md5');
    const baseURL = process.env.REACT_APP_BASE_URL;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    let timestamp = new Date().getTime();
    const stringToHash = timestamp + privateKey + publicKey;
    const hash = md5(stringToHash);
    if(SeriesOffset === 0) {
        return baseURL+`/v1/public/series?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
    } else {
        return baseURL+`/v1/public/series?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&offset=${SeriesOffset}`;
    }
}

const buildCard = (series) => {
    console.log('Cards built');
    return(
        <Link to={`/series/${series.id}`}>
            <div key={series.id} className="rounded-lg overflow-hidden hover:scale-105 space-x-6 transform transition duration-200 bg-red-200 border-red-600 border-2">
                <div>
                    <img
                        src={`${series.thumbnail.path}.${series.thumbnail.extension}`}
                        alt={series.title}
                        className="object-center h-full object-cover w-full lg:h-80"
                    />
                </div>
                <div className="my-4 text-center">
                    {series.title}
                </div>
            </div>
        </Link>
    )
}

export default SeriesList