import { connectToDatabase } from "../../../../lib/db";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { ObjectId } from "mongodb";

const newCommentHandler = async (req, res) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ errorMessage: "Unauthenticated!" });
    }

    let { comment, itemNo, versusId } = req.body;

    comment = comment.trim();

    if (!comment) {
      return res.status(400).json({ errorMessage: "Empty comment!" });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const versus = await db
      .collection("versuses")
      .findOne({ _id: ObjectId(versusId) });

    if (!versus) {
      client.close();
      return res.status(404).json({ errorMessage: "Versus not found!" });
    }

    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(session.user.id) });

    if (!user) {
      client.close();
      return res.status(404).json({ errorMessage: "User not found!" });
    }

    const commentToPush = {
      ownerId: user._id,
      comment,
      itemNo,
      versusId: versus._id,
      dateAdded: new Date(),
      ownerUsername: user.username,
    };

    await db.collection("comments").insertOne(commentToPush);

    client.close();
    res.status(200).json({ comment: commentToPush });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const deleteCommentHandler = async (req, res) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ errorMessage: "Unauthenticated!" });
    }

    const { commentId } = req.body;

    const client = await connectToDatabase();
    const db = client.db();

    const comment = await db.collection("comments").findOne({
      _id: ObjectId(commentId),
      ownerId: ObjectId(session.user.id),
    });

    if (!comment) {
      client.close();
      res.status(404).json({ errorMessage: "Comment not found!" });
    }

    await db.collection("comments").deleteOne({
      _id: ObjectId(commentId),
      ownerId: ObjectId(session.user.id),
    });

    client.close();
    res
      .status(200)
      .json({ successMessage: "Comment was successfully deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    await newCommentHandler(req, res);
  } else if (req.method === "DELETE") {
    await deleteCommentHandler(req, res);
  }
};

export default handler;
