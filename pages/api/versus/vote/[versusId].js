import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { connectToDatabase } from "../../../../lib/db";
import { ObjectId } from "mongodb";

const onVoteHandler = async (req, res) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    const { versusId } = req.query;
    const { itemNo } = req.body;

    if (!session) {
      return res.status(401).json({ errorMessage: "Unauthenticated!" });
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

    const userId = session.user.id;

    const alreadyVoted0 = await db.collection("versuses").count({
      _id: ObjectId(versusId),
      votes_0: { $in: [userId] },
    });

    const alreadyVoted1 = await db.collection("versuses").count({
      _id: ObjectId(versusId),
      votes_1: { $in: [userId] },
    });

    if (itemNo === 0) {
      if (alreadyVoted0 === 0) {
        await db
          .collection("versuses")
          .updateOne(
            { _id: ObjectId(versusId) },
            { $push: { votes_0: userId } }
          );

        if (alreadyVoted1 === 1) {
          await db
            .collection("versuses")
            .updateOne(
              { _id: ObjectId(versusId) },
              { $pull: { votes_1: userId } }
            );
        }
      } else {
        await db
          .collection("versuses")
          .updateOne(
            { _id: ObjectId(versusId) },
            { $pull: { votes_0: userId } }
          );
      }
    } else if (itemNo === 1) {
      if (alreadyVoted1 === 0) {
        await db
          .collection("versuses")
          .updateOne(
            { _id: ObjectId(versusId) },
            { $push: { votes_1: userId } }
          );

        if (alreadyVoted0 === 1) {
          await db
            .collection("versuses")
            .updateOne(
              { _id: ObjectId(versusId) },
              { $pull: { votes_0: userId } }
            );
        }
      } else {
        await db
          .collection("versuses")
          .updateOne(
            { _id: ObjectId(versusId) },
            { $pull: { votes_1: userId } }
          );
      }
    }

    client.close();
    res.status(200).json({ successMessage: "Successfully voted!" });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const checkVoteHandler = async (req, res) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    const { versusId } = req.query;

    if (!session) {
      return res.status(401).json({ errorMessage: "Unauthenticated!" });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const userId = session.user.id;

    const alreadyVoted0 = await db.collection("versuses").count({
      _id: ObjectId(versusId),
      votes_0: { $in: [userId] },
    });

    if (alreadyVoted0 === 1) {
      client.close();
      return res.status(200).json({ vote: 0 });
    }

    const alreadyVoted1 = await db.collection("versuses").count({
      _id: ObjectId(versusId),
      votes_1: { $in: [userId] },
    });

    if (alreadyVoted1 === 1) {
      client.close();
      return res.status(200).json({ vote: 1 });
    }

    client.close();
    res.status(200).json({ vote: -1 });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    await onVoteHandler(req, res);
  } else if (req.method === "GET") {
    await checkVoteHandler(req, res);
  }
};

export default handler;
