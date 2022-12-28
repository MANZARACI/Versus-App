import { connectToDatabase } from "../../../lib/db";

const handler = async (req, res) => {
  try {
    const { word, limit } = req.query;

    const agg = [
      {
        $search: {
          index: "versus_index",
          compound: {
            should: [
              {
                autocomplete: {
                  path: "item_0",
                  query: word,
                },
              },
              {
                autocomplete: {
                  path: "item_1",
                  query: word,
                },
              },
            ],
          },
        },
      },
      {
        $limit: +limit,
      },
      {
        $project: {
          _id: 1,
          item_0: 1,
          item_1: 1,
        },
      },
    ];

    const client = await connectToDatabase();
    const db = client.db();
    const cursor = db.collection("versuses").aggregate(agg);

    const versuses = [];
    await cursor.forEach((doc) => versuses.push(doc));
    client.close();

    res.status(200).json({ versuses });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export default handler;
