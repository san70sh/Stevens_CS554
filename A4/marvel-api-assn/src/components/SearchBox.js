import React from "react";

const SearchBox = (props) => {
    const searchEvent = (e) => {
        props.searchKey(e.target.value)
    };
    return (
        <form method="POST" onSubmit={(e) => e.preventDefault()} name="searchBox">
            <label for="searchKey"> Search: 
                <input autoComplete="off" type="text" name="searchKey" onChange={searchEvent} placeholder="Search for your favourites here" className="content-center w-full py-2 pl-9 pr-3 border-2 border-slate-200 bg-white rounded-lg focus:outline-none placeholder:italic focus:border-red-300"/>
            </label>
        </form>
    )
}

export default SearchBox;