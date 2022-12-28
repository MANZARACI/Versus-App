import { connectToDatabase } from "../../../lib/db";

const handler = async (req, res) => {
  try {
    const { word, limit } = req.query;

    const agg = [
      {
        $search: {
          index: "user_index",
          autocomplete: {
            path: "username",
            query: word,
          },
        },
      },
      {
        $limit: +limit,
      },
      {
        $project: {
          _id: 1,
          username: 1,
        },
      },
    ];

    const client = await connectToDatabase();
    const db = client.db();
    const cursor = db.collection("users").aggregate(agg);

    const users = [];
    await cursor.forEach((doc) => users.push(doc));
    client.close();

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export default handler;
