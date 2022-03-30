import React from "react";
import { Link } from "react-router-dom";

export default function Pagination ({
    elementsPerPage,
    totalElements,
    currentPage,
    elementOffset,
    api
}) {
    return (
        <div className="m-2 text-center">
            <div>
                <p>
                    Showing <span>{(currentPage) * elementsPerPage}</span> to <span> {((currentPage+1) * elementsPerPage) < totalElements ? (currentPage+1) * elementsPerPage : totalElements} </span> of <span> {totalElements} </span> results
                </p>
            </div>
            <div className="inline-flex mt-3">
                { elementOffset !== 0 ? <Link to={`${api}/${currentPage-1}`} aria-label="Previous Page">
                                    <button className="bg-red-200 hover:bg-red-500 text-gray-800 font-bold py-2 px-4 rounded-l">
                                        Prev
                                    </button>
                </Link> : <Link to={`${api}/${currentPage-1}`} aria-label="Previous Page">
                                    <button className="bg-red-200 hover:bg-red-500 text-gray-800 font-bold py-2 px-4 rounded-l hidden">
                                        Prev
                                    </button>
                </Link> }
                <span className="py-2 px-4">{currentPage}</span>
                { elementOffset + elementsPerPage < totalElements ? <Link to={`${api}/${currentPage+1}`} aria-label="Next Page">
                                    <button className="bg-red-200 hover:bg-red-500 text-gray-800 font-bold py-2 px-4 rounded-r">
                                        Next
                                    </button>
                </Link> : <Link to={`${api}/${currentPage+1}`} aria-label="Next Page">
                                    <button className="bg-red-200 hover:bg-red-500 text-gray-800 font-bold py-2 px-4 rounded-r hidden">
                                        Next
                                    </button>
                </Link>}
            </div>
        </div>
    )
}