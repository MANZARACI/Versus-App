import React, { useState } from "react";
import { connectToDatabase } from "../../lib/db";
import { ObjectId } from "mongodb";
import InfiniteScroll from "react-infinite-scroll-component";
import VersusCardHome from "../../components/VersusCardHome";
import Head from "next/head";

const UserPage = (props) => {
  const [versuses, setVersuses] = useState(props.versuses);
  const [hasMore, setHasMore] = useState(true);
  const [counter, setCounter] = useState(props.counter);

  const title = `${props.user.username} / Versus`;

  const fetchVersuses = async () => {
    try {
      const response = await fetch(
        "/api/versus?skip=" + counter + "&userId=" + props.user.id
      );

      const data = await response.json();

      if (data.versuses.length === 0) {
        setHasMore(false);
      } else {
        setVersuses((prev) => [...prev, ...data.versuses]);
        setCounter((prev) => prev + data.versuses.length);
      }
    } catch (error) {
      setHasMore(false);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="min-h-screen py-20">
        <section className="bg-[#222222] w-4/5 md:max-w-md mx-auto rounded-md p-4">
          <h2 className="text-2xl font-mono">{props.user.username}</h2>
          <p className="mt-3 ml-2">
            <span className="font-Rubik text-xl text-purple-400">VS</span>
            <span className="text-lg ml-2">{props.versusCount}</span>
          </p>
        </section>

        <InfiniteScroll
          className="w-4/5 max-w-[50rem] mx-auto pb-2"
          hasMore={hasMore}
          dataLength={versuses.length}
          next={fetchVersuses}
          loader={
            versuses.length >= props.counter && (
              <h4 className="font-Rubik text-center text-2xl font-bold mt-10">
                Loading...
              </h4>
            )
          }
          endMessage={
            <h4 className="font-Rubik text-center text-2xl font-bold mt-10">
              The End
            </h4>
          }
        >
          <ul>
            {versuses.map((versus) => {
              return <VersusCardHome key={versus._id} versus={versus} />;
            })}
          </ul>
        </InfiniteScroll>
      </main>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { userId } = context.query;
  const counter = 5;

  try {
    const client = await connectToDatabase();
    const db = client.db();

    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(userId) });

    if (!user) {
      client.close();
      return {
        notFound: true,
      };
    }

    const versuses = await db
      .collection("versuses")
      .find({ owner_id: user._id })
      .sort({ date_added: -1 })
      .limit(counter)
      .toArray();

    const versusCount = await db
      .collection("versuses")
      .count({ owner_id: user._id });

    const userToReturn = { id: user._id, username: user.username };

    client.close();
    return {
      props: {
        user: JSON.parse(JSON.stringify(userToReturn)),
        versuses: JSON.parse(JSON.stringify(versuses)),
        versusCount,
        counter,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default UserPage;
