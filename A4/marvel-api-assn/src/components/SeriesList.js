import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";

const SeriesList = () => {
    const [loading, setLoading] = useState(true);
    // const [searchTerm, setSearchTerm] = useState(undefined);
    const [SeriesData, setSeriesData] = useState(undefined);
    // const [searchData, setSearchData] = useState(undefined);
    const [comOffset, setComOffset] = useState(0);
    const [comLimit] = useState(20);
    const [comTotal, setComTotal] = useState(0);
    let comCard = null;
    let {page} = useParams();
    useEffect(() => {
        async function fetchSeries() {
            let url = null;
            try {
                url = targetUrl(comOffset);
                let {data} = await axios.get(url);
                setLoading(false);
                setComOffset(comLimit*(parseInt(page)));
                let comData = data.data, code = data.code;
                let {results, total} = comData;
                setComTotal(total);
                if(code === 404) {
                    return null;
                } else {
                    setSeriesData(results);
                }
            } catch (e) {
                console.log(e);
            }

        }
        fetchSeries();
    }, [comLimit, comOffset, page])

    if(SeriesData) {
        comCard = SeriesData.map((Series) => {
            return buildCard(Series);
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
            <div>
                <div>
                    <Pagination 
                        charactersPerPage={comLimit}
                        characterOffset = {comOffset}
                        totalCharacters={comTotal}
                        currentPage={parseInt(page)}
                    />

                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                    {comCard}
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
        <div key={series.id} className="p-2">
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                    src={`${series.thumbnail.path}.${series.thumbnail.extension}`}
                    alt={series.name}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <p>{series.description}</p>
                </div>
            </div>
        </div>
    )
}

export default SeriesList