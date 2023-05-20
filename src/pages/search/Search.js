import React from "react";
import { useSelector } from "react-redux";

import SearchResults from "./SearchResult";

const Search = () => {
  const results = useSelector((state) => state.results);


  return (
    <div className="text-black justify-center text-center w-full m-8 gap-4 items-center flex ">
      <SearchResults searchResults={results} />

    </div>
  );
};

export default Search;
