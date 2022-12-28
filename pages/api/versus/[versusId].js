import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/db";

const handler = async (req, res) => {
  const { versusId } = req.query;
  try {
    const client = await connectToDatabase();
    const db = client.db();

    const versus = await db
      .collection("versuses")
      .findOne({ _id: ObjectId(versusId) });

    if (!versus) {
      client.close();
      return res.status(404).json({ errorMessage: "Versus not found!" });
    }

    client.close();
    res.status(200).json({ versus });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export default handler;
