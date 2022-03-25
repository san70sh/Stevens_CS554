import React from "react";
import { Link } from "react-router-dom";

export default function Pagination ({
    charactersPerPage,
    totalCharacters,
    currentPage,
    characterOffset
}) {
    return (
        <div className="py-2">
            <div>
                <p className='text-sm text-gray-700'>
                    Showing
                    <span className='font-medium'>{(currentPage+1) * charactersPerPage - charactersPerPage}</span>
                    to
                    <span className='font-medium'> {(currentPage+1) * charactersPerPage} </span>
                    of
                    <span className='font-medium'> {totalCharacters} </span>
                    results
                </p>
            </div>
            <nav className='block'></nav>
            <div>
                <nav
                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                aria-label='Pagination'
                >
                    { characterOffset !== 0 ?
                    <Link to={`/characters/page/${currentPage-1}`}
                        className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                    >
                        <span>Previous</span>
                    </Link> : null
                    }
                    { characterOffset + charactersPerPage !== totalCharacters ? 
                    <Link to={`/characters/page/${currentPage+1}`}
                        className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                    >
                        <span>Next</span>
                    </Link> : null
                    }
                </nav>
            </div>
        </div>
    )
}