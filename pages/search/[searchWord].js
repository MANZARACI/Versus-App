import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const SearchPage = () => {
  const router = useRouter();
  const { searchWord } = router.query;

  const [versuses, setVersuses] = useState([]);
  const [users, setUsers] = useState([]);

  const title = `${!!searchWord && searchWord} - Versus Search / Versus`;

  const fetchSearchVersuses = async () => {
    const response = await fetch(
      `/api/autocomplete/versus?word=${searchWord}&limit=5`
    );

    const data = await response.json();

    setVersuses(data.versuses);
  };

  const fetchSearchUsers = async () => {
    const response = await fetch(
      `/api/autocomplete/user?word=${searchWord}&limit=5`
    );

    const data = await response.json();

    setUsers(data.users);
  };

  useEffect(() => {
    if (searchWord) {
      fetchSearchUsers();
      fetchSearchVersuses();
    }
  }, [searchWord]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="min-h-screen py-20 flex flex-col items-center space-y-8 md:space-y-0 md:flex-row md:items-start md:justify-center md:space-x-8">
        <section className="bg-[#222222] w-4/5 md:w-1/3 md:max-w-md rounded-lg p-4">
          <h2 className="text-2xl inline font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300">
            Versuses
          </h2>
          <ul>
            {versuses.map((versus) => {
              return (
                <li key={versus._id}>
                  <button
                    onClick={() => router.push(`/versus/${versus._id}`)}
                    className="w-full font-mono text-left text-xl rounded-lg mt-1 py-2 px-1 hover:bg-[#353535]"
                  >
                    {versus.item_0}
                    <span className="font-Rubik text-purple-400 mx-2">VS</span>
                    {versus.item_1}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="bg-[#222222] w-4/5 md:w-1/3 md:max-w-md rounded-lg p-4">
          <h2 className="text-2xl inline font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300">
            Users
          </h2>
          <ul>
            {users.map((user) => {
              return (
                <li key={user._id}>
                  <button
                    className="w-full font-mono text-left text-xl rounded-lg mt-1 py-2 px-1 hover:bg-[#353535]"
                    onClick={() => router.push(`/user/${user._id}`)}
                  >
                    {user.username}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
};

export default SearchPage;
