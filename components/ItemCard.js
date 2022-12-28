import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentLine from "./CommentLine";

const ItemCard = (props) => {
  const { item } = props;

  const { data: session, status } = useSession();

  const [isVoted, setIsVoted] = useState();
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState("");
  const [loadedComments, setLoadedComments] = useState(
    props.initComments ? props.initComments : []
  );
  const [hasMore, setHasMore] = useState(true);
  const [counter, setCounter] = useState(
    props.initComments ? props.initComments.length : 0
  );
  const [addedComments, setAddedComments] = useState([]);

  const router = useRouter();

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(
        `/api/versus/comment/count/${item.versusId}`
      );

      const data = await response.json();

      setCommentCount(data["commentCount_" + item.no]);
    } catch (error) {
      setCommentCount("problem");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/versus/comment/${item.versusId}?skip=` + counter
      );
      const data = await response.json();

      const identifier = "comments_" + item.no;

      if (data[identifier].length === 0) {
        setHasMore(false);
      } else {
        setLoadedComments((prev) => [...prev, ...data[identifier]]);
        setCounter((prev) => prev + data[identifier].length);
      }
    } catch (error) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchCommentCount();
  }, []);

  useEffect(() => {
    setIsVoted(item.no === props.votedItemNo);
  }, [props.votedItemNo]);

  const imageClickHandler = () => {
    router.push(item.imageUrl);
  };

  const voteClickHandler = () => {
    props.onVote(item.no);
  };

  const commentClickHandler = async () => {
    if (newComment.trim()) {
      if (!session) {
        toast.warn("You must login to do that!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        });
        return;
      }

      const toastId = toast.loading("Commenting...", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      try {
        const response = await fetch("/api/versus/comment", {
          method: "POST",
          body: JSON.stringify({
            itemNo: item.no,
            versusId: item.versusId,
            comment: newComment,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.comment) {
          await fetchCommentCount();
          if (!hasMore || loadedComments.length < 5) {
            setAddedComments((prev) => [...prev, data.comment]);
          }
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
    }
  };

  return (
    <section className={props.className}>
      <h2 className="text-center font-mono font-semibold text-xl my-2">
        {item.name}
      </h2>
      <hr />
      {item.imageUrl && (
        <>
          <div
            onClick={imageClickHandler}
            className="w-full h-[20vh] md:h-[40vh] relative cursor-pointer hover:brightness-75 hover:shadow-lg hover:shadow-purple-400"
          >
            <Image
              fill
              sizes="(max-width: 768px) 80vw, 45vw"
              className="object-cover"
              src={item.imageUrl}
              alt={`image of ${item.name}`}
            />
          </div>
          <hr />
        </>
      )}
      <div className="h-12 flex items-center justify-between font-semibold px-3">
        <span className="border border-purple-500 rounded-md">
          <button
            onClick={voteClickHandler}
            className="bg-purple-500 hover:bg-purple-600 rounded-l-md px-2 py-1"
          >
            {isVoted ? "Voted" : "Vote"}
          </button>
          <span className="mx-2">{item.votes.length}</span>
        </span>
        <span className="flex">
          <img className="h-7 mr-2" src="/comment-solid.svg" />
          {commentCount}
        </span>
      </div>
      <hr />
      <InfiniteScroll
        height="8rem"
        next={fetchComments}
        hasMore={hasMore}
        dataLength={loadedComments.length}
        endMessage={<h4 className="text-center">The End</h4>}
      >
        <ul>
          {loadedComments.map((comment) => {
            return (
              <CommentLine
                afterDelete={fetchCommentCount}
                key={comment._id}
                comment={comment}
              />
            );
          })}
          {addedComments.map((comment) => {
            return (
              <CommentLine
                afterDelete={fetchCommentCount}
                key={comment._id}
                comment={comment}
              />
            );
          })}
        </ul>
      </InfiniteScroll>
      <hr />
      <div className="flex">
        <input
          onChange={(event) => setNewComment(event.target.value)}
          className="w-full bg-zinc-700"
          type="text"
        />
        <button
          onClick={commentClickHandler}
          className="bg-purple-500 hover:bg-purple-600 font-semibold px-2 py-1"
        >
          Comment
        </button>
      </div>
    </section>
  );
};

export default ItemCard;
