import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const VersusCardHome = ({ versus }) => {
  const [dateString, setDateString] = useState("");
  const [timeString, setTimeString] = useState("");
  const [commentCounts, setCommentCounts] = useState();

  const router = useRouter();

  const fullDate = new Date(versus.date_added);

  const fetchCommentCounts = async () => {
    const response = await fetch(`/api/versus/comment/count/${versus._id}`);
    const data = await response.json();
    setCommentCounts(data);
  };

  useEffect(() => {
    fetchCommentCounts();
    setDateString(fullDate.toLocaleDateString());
    setTimeString(fullDate.toLocaleTimeString().slice(0, -3));
  }, []);

  const onClickHandler = () => {
    router.push(`/versus/${versus._id}`);
  };

  return (
    <li
      onClick={onClickHandler}
      className="bg-[#222222] hover:bg-[#353535] shadow-md hover:shadow-purple-400 rounded-lg flex flex-col p-5 mt-12 cursor-pointer"
    >
      <section className="flex flex-col md:flex-row md:justify-center md:items-center">
        <div className="flex flex-col md:w-5/12">
          <h2 className="font-mono text-2xl font-bolder mb-4 text-center md:text-start">
            {versus.item_0}
          </h2>
          {versus.image_0 && (
            <div className="w-full h-[20vh] relative">
              <Image
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover"
                src={versus.image_0}
                alt={`image of ${versus.item_0}`}
              />
            </div>
          )}
          <div className="font-Rubik text-lg text-purple-300 flex justify-between items-center mt-2">
            <span>Votes: {versus.votes_0.length}</span>
            <span>
              <img className="h-5 inline" src="/comment-solid.svg" />{" "}
              {commentCounts && commentCounts.commentCount_0}
            </span>
          </div>
        </div>
        <span className="font-Rubik md:w-1/6 text-3xl font-bolder text-center my-4 md:my-0 text-purple-500">
          VS
        </span>
        <div className="flex flex-col md:w-5/12">
          <h2 className="font-mono text-2xl font-bolder mb-4 text-center md:text-end">
            {versus.item_1}
          </h2>
          {versus.image_1 && (
            <div className="w-full h-[20vh] relative">
              <Image
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover"
                src={versus.image_1}
                alt={`image of ${versus.item_1}`}
              />
            </div>
          )}
          <div className="font-Rubik text-lg text-purple-300 flex justify-between items-center mt-2">
            <span>
              <img className="h-5 inline" src="/comment-solid.svg" />{" "}
              {commentCounts && commentCounts.commentCount_1}
            </span>
            <span>Votes: {versus.votes_1.length}</span>
          </div>
        </div>
      </section>

      <div className="flex justify-between font-Rubik mt-2">
        <span>{timeString}</span>
        <span>{dateString}</span>
      </div>
    </li>
  );
};

export default VersusCardHome;
