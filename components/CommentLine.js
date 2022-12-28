import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const CommentLine = ({ comment, afterDelete }) => {
  const { data: session, status } = useSession();

  const [isDeleted, setIsDeleted] = useState(false);

  const isOwner = session?.user && session.user.id === comment.ownerId;

  const deleteHandler = async () => {
    const toastId = toast.loading("Deleting comment...", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

    try {
      const response = await fetch("/api/versus/comment", {
        method: "DELETE",
        body: JSON.stringify({ commentId: comment._id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.successMessage) {
        await afterDelete();
        setIsDeleted(true);
        toast.dismiss();
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

  if (isDeleted) {
    return (
      <li className="bg-red-500 text-lg font-bold text-center">Deleted</li>
    );
  }

  return (
    <li className="flex justify-between items-center p-2">
      <span>
        <p className="inline font-bold">{comment.ownerUsername}:</p>{" "}
        {comment.comment}
      </span>

      {isOwner && (
        <button
          onClick={deleteHandler}
          className="bg-red-600 font-semibold rounded p-1"
        >
          Delete
        </button>
      )}
    </li>
  );
};

export default CommentLine;
