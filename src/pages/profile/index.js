import { auth } from "../../firebase";

import { NavLink, Outlet } from "react-router-dom";
import classNames from "classnames";
import NotFound from "./NotFound";
import { Helmet } from "react-helmet";
import Icon from "../../components/Icon";
import Header from "./components/Header";
import React, { useEffect, useState } from "react";


function ProfileLayout() {
  const currentUser = auth.currentUser;
  const displayName = currentUser ? currentUser.displayName : null;
  //  const user = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  
  if (displayName === false) {
    return <NotFound />;
  }

  if (displayName) {
    return (
      <div className="grid justify-center items-center w-full">
        <Helmet>
          <title>{user.displayName} / Chatapp</title>
        </Helmet>
        <Header user={user} />
        <nav className="border-t flex gap-x-16 justify-center items-center">
          <NavLink
            to={`/${displayName}`}
            end={true}
            className={({ isActive }) =>
              classNames({
                "text-xs flex py-5 border-t tracking-widest items-center gap-x-1.5 font-semibold": true,
                "text-[#8e8e8e] border-transparent": !isActive,
                "text-black border-black": isActive,
              })
            }
          >
            <Icon name="posts" size={12} />
            GÖNDERİLER
          </NavLink>
          <NavLink
            to={`/${displayName}/reels`}
            end={true}
            className={({ isActive }) =>
              classNames({
                "text-xs flex py-5 border-t tracking-widest items-center gap-x-1.5 font-semibold": true,
                "text-[#8e8e8e] border-transparent": !isActive,
                "text-black border-black": isActive,
              })
            }
          >
            <Icon name="reels" size={12} />
            REELS
          </NavLink>
          <NavLink
            to={`/${displayName}/tagged`}
            end={true}
            className={({ isActive }) =>
              classNames({
                "text-xs flex py-5 border-t items-center tracking-widest gap-x-1.5 font-semibold": true,
                "text-[#8e8e8e] border-transparent": !isActive,
                "text-black border-black": isActive,
              })
            }
          >
            <Icon name="tickets" size={12} />
            ETİKETLENENLER
          </NavLink>
          <NavLink
            to={`/${displayName}/update`}
            end={true}
            className={({ isActive }) =>
              classNames({
                "text-xs flex py-5 border-t items-center tracking-widest gap-x-1.5 font-semibold": true,
                "text-[#8e8e8e] border-transparent": !isActive,
                "text-black border-black": isActive,
              })
            }
          >
            UPDATE
          </NavLink>
        </nav>
        <Outlet />
      </div>
    );
  }
}

export default ProfileLayout;
