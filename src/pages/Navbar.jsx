import React from "react";
import { useSelector } from "react-redux";
import LogoutButton from "./Logout";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white  shadow-md transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 ">
          Advanced Todo App
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-600 ">
            Welcome, {user?.name}
          </span>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
