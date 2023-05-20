// import Header from "components/Header";
// import Sidebar from "components/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

function MainLayout() {
  return (
    <div>
      <Header />
      <div className="flex">
        
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
