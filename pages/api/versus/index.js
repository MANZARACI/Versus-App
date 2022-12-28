import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import formidable from "formidable";
const cloudinary = require("cloudinary").v2;
import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from "mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const postHandler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ errorMessage: "Unauthenticated!" });
  } else {
    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
      form.parse(req, async (error, fields, files) => {
        if (error) {
          res.status(400).json({ errorMessage: "Something went wrong!" });
          resolve();
          return;
        }

        let { name_0, name_1 } = fields;
        name_0 = name_0.trim();
        name_1 = name_1.trim();

        if (name_0.length === 0 || name_0.length > 20) {
          res.status(422).json({
            errorMessage:
              "Length of the first item's name must be between 1 and 20. (inclusive)",
          });
          resolve();
          return;
        }

        if (name_1.length === 0 || name_1.length > 20) {
          res.status(422).json({
            errorMessage:
              "Length of the second item's name must be between 1 and 20. (inclusive)",
          });
          resolve();
          return;
        }

        const versus = {
          item_0: name_0,
          item_1: name_1,
          image_0: "",
          image_1: "",
        };

        if (files.image_0?.filepath) {
          try {
            const result = await cloudinary.uploader.upload(
              files.image_0.filepath
            );
            versus.image_0 = result.secure_url;
          } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong!" });
            resolve();
            return;
          }
        }

        if (files.image_1?.filepath) {
          try {
            const result = await cloudinary.uploader.upload(
              files.image_1.filepath
            );
            versus.image_1 = result.secure_url;
          } catch (error) {
            res.status(500).json({ errorMessage: "Something went wrong!" });
            resolve();
            return;
          }
        }

        const client = await connectToDatabase();

        const db = client.db();

        const user = await db
          .collection("users")
          .findOne({ username: session.user.username });

        if (!user) {
          client.close();
          res.status(404).json({ errorMessage: "User not found!" });
          resolve();
          return;
        }

        versus.owner_id = user._id;
        versus.date_added = new Date();
        versus.votes_0 = [];
        versus.votes_1 = [];

        await db.collection("versuses").insertOne(versus);

        client.close();
        res.status(201).json({ successMessage: "Versus successfully saved." });
        resolve();
      });
    });
  }
};

const getHandler = async (req, res) => {
  try {
    const { skip } = req.query;

    const client = await connectToDatabase();
    const db = client.db();

    const versuses = await db
      .collection("versuses")
      .find() //find all
      .sort({ date_added: -1 }) //show the newest on top
      .skip(+skip) //skip the versuses that have been scrolled already
      .limit(5) //provide 5 versuses for on scroll request
      .toArray();

    client.close();
    return res.status(200).json({ versuses });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};

const getHandlerWithUser = async (req, res) => {
  try {
    const { userId, skip } = req.query;

    const client = await connectToDatabase();
    const db = client.db();

    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(userId) });

    if (!user) {
      client.close();
      res.status(404).json({ errorMessage: "User not found!" });
    }

    const versuses = await db
      .collection("versuses")
      .find({ owner_id: ObjectId(userId) })
      .sort({ date_added: -1 })
      .skip(+skip)
      .limit(5)
      .toArray();

    client.close();
    return res.status(200).json({ versuses });
  } catch (error) {}
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    await postHandler(req, res);
  } else if (req.method === "GET") {
    const { userId } = req.query;

    if (userId) {
      await getHandlerWithUser(req, res);
    } else {
      await getHandler(req, res);
    }
  }
};

export default handler;
