import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from 'lucide-react';

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-400 tracking-wider">
            Streamify
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Home */}
        <Link
          to="/"
          className={`btn btn-ghost rounded-full justify-start w-full gap-3 px-3 py-6 normal-case ${currentPath === "/" ? "bg-slate-700" : ""
            }`}
        >
          <HomeIcon className="size-5" />
          <span>Home</span>
        </Link>

        {/* Notifications */}
        <Link
          to="/notification"
          className={`btn btn-ghost rounded-full justify-start w-full gap-3 px-3 py-6 normal-case ${currentPath === "/notification" ? "bg-slate-700" : ""
            }`}
        >
          <BellIcon className="size-5" />
          <span>Notifications</span>
        </Link>

        {/* Friends */}
        <Link
          to="/friends"
          className={`btn btn-ghost rounded-full justify-start w-full gap-3 px-3 py-6 normal-case ${currentPath === "/friends" ? "bg-slate-700" : ""
            }`}
        >
          <UsersIcon className="size-5" />
          <span>Friends</span>
        </Link>
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
