import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      
      <div className="flex items-center justify-center text-center w-full">
        
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
