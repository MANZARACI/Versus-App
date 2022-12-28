import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { data: session, status } = useSession();

  const [navState, setNavState] = useState("");

  const menuStateHandler = () => {
    setNavState((prev) => {
      if (prev === "menu") {
        return "";
      } else {
        return "menu";
      }
    });
  };

  const searchStateHandler = () => {
    setNavState((prev) => {
      if (prev === "search") {
        return "";
      } else {
        return "search";
      }
    });
  };

  return (
    <nav className="z-10 fixed top-0 bg-[#121212] w-full h-14 flex justify-around items-center">
      <Link
        href="/"
        className="font-Rubik leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 text-2xl font-bold"
      >
        Versus
      </Link>

      <SearchBar navState={navState} />

      <div className="flex items-center space-x-3">
        <button onClick={searchStateHandler} className="navbar-btn md:hidden">
          <img className="h-5" src="/magnifying-glass-solid.svg" />
        </button>
        {session?.user && (
          <Link href="/versus/new" className="navbar-btn">
            <img className="h-5" src="/plus-solid.svg" />
          </Link>
        )}

        {session?.user ? (
          <>
            <button onClick={menuStateHandler} className="navbar-btn md:hidden">
              <img className="h-5" src="/caret-down-solid.svg" />
            </button>
            <div
              className={`bg-[#121212] w-full md:w-auto px-8 md:px-0 pb-4 md:pb-0 absolute md:static right-0 top-14 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 ${
                navState !== "menu" && "m-md:hidden"
              }`}
            >
              <a
                href={`/user/${session.user.id}`}
                className="navbar-btn text-center"
              >
                {session.user.username}
              </a>
              <button
                onClick={() => signOut({ redirect: false })}
                className="navbar-btn bg-red-600 hover:bg-red-800"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="navbar-btn bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>

      {/* <div className="flex items-center space-x-3">
        {session?.user ? (
          <>
            <Link href="/versus/new" className="navbar-btn">
              +
            </Link>
            <a href={`/user/${session.user.id}`} className="navbar-btn">
              {session.user.username}
            </a>
            <button
              onClick={() => signOut({ redirect: false })}
              className="navbar-btn bg-red-600 hover:bg-red-800"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="navbar-btn bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div> */}
    </nav>
  );
};

export default Navbar;
