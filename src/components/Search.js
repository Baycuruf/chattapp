import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const Search = ({ handleSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      // Boş arama yapılırsa, hiçbir şey gösterme
      handleSearchResults([]);

      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", ">=", searchTerm),
        where("username", "<=", searchTerm + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const searchResults = querySnapshot.docs.map((doc) => doc.data());
      handleSearchResults(searchResults);
    } catch (error) {
      console.error("Firestore error:", error);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <NavLink to="/search" className="flex items-center gap-2">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Klavye olaylarını dinle
        placeholder="Kullanıcı adı ara..."
        className="text-black h-10 p-2"
      />
      <button onClick={handleSearch} className="items-center justify-center text-center">
        <Icon name="search" size={24}  />
      </button>
    </NavLink>
  );
};

export default Search;
