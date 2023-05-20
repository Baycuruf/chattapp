import { auth, logout } from "../firebase";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "./Icon";
import classNames from "classnames";
import Search from "./Search";
import { useDispatch } from "react-redux";
import { setResults } from "../stores/results"; // setResults'ı içeri aktardım


function Header() {
  
  
  const dispatch = useDispatch();

  const handleSearchResults = (searchResults) => {
    dispatch(setResults(searchResults));
  };


  
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  return (
    <header className="bg-[#f4ca15] border-b border-gray-300 text-[red]">
      <div className="flex items-center justify-between h-[60px] container mx-auto">
        <Link to="/">
          <img className="h- w-20" alt="bulunamadı" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Soviet_Red_Army_Hammer_and_Sickle.svg/800px-Soviet_Red_Army_Hammer_and_Sickle.svg.png"></img>  
        </Link>
        {/* <Icon name="chatting-app" size={128}/> */}
        <Search handleSearchResults={handleSearchResults} />
        <nav className="flex items-center gap-x-5">
          <NavLink to="/">
          {({isActive}) => isActive ? <Icon name="home-filled-2" size={23}/> : <Icon name="home-3" size={23}/>}
          </NavLink>
          <NavLink to="/inbox">
            {({isActive}) => isActive ? <Icon name="message-filled" size={27}/> : <Icon name="message" size={27}/>}
          </NavLink>
          <NavLink to="/posts">
          {({isActive}) => isActive ? <Icon name="create-filled" size={24}/> : <Icon name="create" size={24}/>}
          </NavLink>
          <NavLink to="/explore">
          {({isActive}) => isActive ? <Icon name="explore-filled" size={24}/> : <Icon name="explore" size={24}/>}
          </NavLink>
          <NavLink to="/likes">
          {({isActive}) => isActive ? <Icon name="heart-filled" size={24}/> : <Icon name="heart" size={24}/>}
          </NavLink>
            <NavLink to={`/${user.displayName}`}>
              {({isActive}) => <img alt="" src={user.photoURL || '/no-avatar.jpg'} className={classNames({
                "w-6 h-6 rounded-full": true,
                "ring-1 ring-offset-1 ring-[red]" : isActive
              })} />}
            </NavLink>
            <button onClick={logout}>Çıkış Yap</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
