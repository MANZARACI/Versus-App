import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../lib/db";

const handler = async (req, res) => {
  try {
    const { versusId } = req.query;

    const client = await connectToDatabase();
    const db = client.db();

    const commentCount_0 = await db.collection("comments").count({
      versusId: ObjectId(versusId),
      itemNo: 0,
    });

    const commentCount_1 = await db.collection("comments").count({
      versusId: ObjectId(versusId),
      itemNo: 1,
    });

    const commentCounts = { commentCount_0, commentCount_1 };

    client.close();
    res.status(200).json(commentCounts);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export default handler;
