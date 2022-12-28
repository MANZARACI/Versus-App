import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../lib/db";

const handler = async (req, res) => {
  try {
    const { versusId, skip } = req.query;

    const client = await connectToDatabase();
    const db = client.db();

    const comments_0 = await db
      .collection("comments")
      .find({ versusId: ObjectId(versusId), itemNo: 0 })
      .sort({ dateAdded: 1 })
      .skip(+skip)
      .limit(5)
      .toArray();

    const comments_1 = await db
      .collection("comments")
      .find({ versusId: ObjectId(versusId), itemNo: 1 })
      .sort({ dateAdded: 1 })
      .skip(+skip)
      .limit(5)
      .toArray();

    const comments = { comments_0, comments_1 };

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export default handler;
