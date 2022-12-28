import { connectToDatabase } from "../lib/db";
import { useState } from "react";
import VersusCardHome from "../components/VersusCardHome";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";

export default function Home(props) {
  const [versuses, setVersuses] = useState(
    props.versuses ? props.versuses : []
  );
  const [counter, setCounter] = useState(props.counter);
  const [hasMore, setHasMore] = useState(true);

  const getVersuses = async () => {
    try {
      const response = await fetch("/api/versus?skip=" + counter);

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

  if (props.error) {
    return (
      <h4 className="text-center text-3xl font-bold mt-32">
        Something went wrong!
      </h4>
    );
  } else if (versuses.length === 0) {
    return (
      <h4 className="text-center text-3xl font-bold mt-32">No versus found!</h4>
    );
  }

  return (
    <>
      <Head>
        <title>Home / Versus</title>
      </Head>
      <main className="py-10">
        <InfiniteScroll
          hasMore={hasMore}
          className="w-4/5 max-w-[50rem] mx-auto pb-2"
          dataLength={versuses.length}
          next={getVersuses}
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
}

export const getServerSideProps = async () => {
  const counter = 5;
  const props = {};
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const versuses = await db
      .collection("versuses")
      .find()
      .sort({ date_added: -1 })
      .limit(counter)
      .toArray();

    client.close();
    props.versuses = JSON.parse(JSON.stringify(versuses));
    props.counter = counter;
  } catch (error) {
    props.error = true;
  }

  return {
    props,
  };
};
