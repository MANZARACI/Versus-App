import React, { useEffect, useState } from "react";
import { connectToDatabase } from "../../lib/db";
import { ObjectId } from "mongodb";
import ItemCard from "../../components/ItemCard";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import Head from "next/head";

const fetchVersus = async (versusId) => {
  const response = await fetch(`/api/versus/${versusId}`);
  const data = await response.json();

  return data.versus;
};

const fetchVote = async (versusId) => {
  const response = await fetch(`/api/versus/vote/${versusId}`);
  const data = await response.json();

  return data.vote;
};

const VersusPage = (props) => {
  const { data: session, status } = useSession();

  const [versus, setVersus] = useState(props.versus);
  const [votedItemNo, setVotedItemNo] = useState(-1);
  const [dateString, setDateString] = useState("");
  const [timeString, setTimeString] = useState("");

  const fullDate = new Date(versus.date_added);

  if (props.error) {
    return (
      <h4 className="text-center text-3xl font-bold mt-32">
        Something went wrong
      </h4>
    );
  }

  const item0 = {
    no: 0,
    versusId: versus._id,
    name: versus.item_0,
    imageUrl: versus.image_0,
    votes: versus.votes_0,
  };

  const item1 = {
    no: 1,
    versusId: versus._id,
    name: versus.item_1,
    imageUrl: versus.image_1,
    votes: versus.votes_1,
  };

  useEffect(() => {
    if (session) {
      fetchVote(versus._id)
        .then((vote) => {
          setVotedItemNo(vote);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [session]);

  useEffect(() => {
    setDateString(fullDate.toLocaleDateString());
    setTimeString(fullDate.toLocaleTimeString().slice(0, -3));
  }, []);

  const onVoteHandler = async (itemNo) => {
    if (!session) {
      toast.warn("You must login to do that!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    const toastId = toast.loading("Voting...", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

    try {
      const response = await fetch(`/api/versus/vote/${versus._id}`, {
        method: "PATCH",
        body: JSON.stringify({ itemNo }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.successMessage) {
        const fetchedVersus = await fetchVersus(versus._id);
        const fetchedVote = await fetchVote(versus._id);

        setVersus(fetchedVersus);
        setVotedItemNo(fetchedVote);

        toast.dismiss();
      } else if (data.errorMessage) {
        toast.update(toastId, {
          render: data.errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const title = `${versus.item_0} VS ${versus.item_1} / Versus`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="min-h-screen py-10 md:flex md:flex-col md:justify-center">
        <div className="w-4/5 max-w-[65rem] mx-auto mt-14 md:mt-0 flex flex-col md:flex-row md:items-center">
          <ItemCard
            initComments={props.comments.comments_0}
            onVote={onVoteHandler}
            votedItemNo={votedItemNo}
            item={item0}
            className="bg-[#353535] border-2 border-gray-500 rounded-md w-full"
          />
          <span className="font-Rubik text-purple-400 text-5xl text-center w-full md:w-1/6 p-4">
            VS
          </span>
          <ItemCard
            initComments={props.comments.comments_1}
            onVote={onVoteHandler}
            votedItemNo={votedItemNo}
            item={item1}
            className="bg-[#353535] border-2 border-gray-500 rounded-md w-full"
          />
        </div>
        <section className="bg-[#222222] w-4/5 md:max-w-md mx-auto rounded-md p-4 mt-10">
          <p>
            Created by:{" "}
            <Link
              href={`/user/${props.owner.id}`}
              className="font-mono text-lg font-semibold"
            >
              {props.owner.username}
            </Link>
          </p>
          <div className="flex justify-between">
            <p className="inline">
              Date: <span className="font-semibold">{dateString}</span>
            </p>
            <p className="inline">
              Time: <span className="font-semibold">{timeString}</span>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { versusId } = context.query;

  try {
    const client = await connectToDatabase();
    const db = client.db();
    const versus = await db
      .collection("versuses")
      .findOne({ _id: ObjectId(versusId) });

    const owner = await db
      .collection("users")
      .findOne({ _id: versus.owner_id });

    const ownerToReturn = { id: owner._id, username: owner.username };

    const comments_0 = await db
      .collection("comments")
      .find({ versusId: ObjectId(versusId), itemNo: 0 })
      .sort({ dateAdded: 1 })
      .limit(5)
      .toArray();

    const comments_1 = await db
      .collection("comments")
      .find({ versusId: ObjectId(versusId), itemNo: 1 })
      .sort({ dateAdded: 1 })
      .limit(5)
      .toArray();

    const comments = { comments_0, comments_1 };

    client.close();

    if (!versus) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        versus: JSON.parse(JSON.stringify(versus)),
        comments: JSON.parse(JSON.stringify(comments)),
        owner: JSON.parse(JSON.stringify(ownerToReturn)),
      },
    };
  } catch (error) {
    return {
      props: {
        error: true,
      },
    };
  }
};

export default VersusPage;
