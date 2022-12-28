import React, { useState, useRef } from "react";
import { useRouter } from "next/router";

const SearchBar = (props) => {
  const inputRef = useRef();

  const router = useRouter();

  const [autoVersuses, setAutoVersuses] = useState([]);
  const [autoUsers, setAutoUsers] = useState([]);
  const [dontComplete, setDontComplete] = useState(false);

  const fetchVersusAutocomplete = async (word) => {
    const response = await fetch(
      `/api/autocomplete/versus?word=${word}&limit=2`
    );

    const data = await response.json();

    setAutoVersuses(data.versuses);
  };

  const fetchUserAutocomplete = async (word) => {
    const response = await fetch(`/api/autocomplete/user?word=${word}&limit=2`);

    const data = await response.json();

    setAutoUsers(data.users);
  };

  const resetAutocomplete = () => {
    setDontComplete(true);
    setAutoUsers([]);
    setAutoVersuses([]);
  };

  const searchChangeHandler = async (event) => {
    setDontComplete(false);
    try {
      if (event.target.value) {
        fetchVersusAutocomplete(event.target.value);
        fetchUserAutocomplete(event.target.value);
      } else {
        resetAutocomplete();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (inputRef.current.value) {
      router.push(`/search/${inputRef.current.value}`);
      resetAutocomplete();
    }
  };

  return (
    <div
      className={`bg-[#121212] absolute md:static top-14 w-full md:w-1/3 h-10 md:rounded-3xl border border-zinc-600 flex ${
        props.navState !== "search" && "m-md:hidden"
      }`}
    >
      <div className="w-full">
        <form onSubmit={submitHandler} className="h-full">
          <input
            ref={inputRef}
            onChange={searchChangeHandler}
            placeholder="Search"
            type="text"
            className="bg-transparent w-full h-full border-r border-zinc-600 md:rounded-l-3xl pl-4"
          />
        </form>
        {(!!autoVersuses.length || !!autoUsers.length) && !dontComplete && (
          <div className="bg-zinc-700 rounded-xl mt-2 p-3">
            {!!autoVersuses.length && (
              <h3 className="font-semibold italic pl-2">Versuses</h3>
            )}
            {autoVersuses.map((versus) => {
              return (
                <button
                  onClick={() => {
                    router.push(`/versus/${versus._id}`);
                    resetAutocomplete();
                    inputRef.current.value = "";
                  }}
                  key={versus._id}
                  className="w-full text-left text-lg my-1 p-1 rounded-lg hover:bg-zinc-800"
                >
                  {versus.item_0}
                  <span className="font-Rubik mx-2">VS</span>
                  {versus.item_1}
                </button>
              );
            })}
            {!!autoUsers.length && (
              <h3 className="font-semibold italic pl-2">Users</h3>
            )}
            {autoUsers.map((user) => {
              return (
                <a
                  href={`/user/${user._id}`}
                  key={user._id}
                  className="block text-left text-lg my-1 p-1 rounded-lg hover:bg-zinc-800"
                >
                  {user.username}
                </a>
              );
            })}
          </div>
        )}
      </div>
      <button
        onClick={submitHandler}
        className="bg-zinc-800 w-16 md:rounded-r-3xl"
      >
        <img className="h-4 mx-auto" src="/magnifying-glass-solid.svg" />
      </button>
    </div>
  );
};

export default SearchBar;
