import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const handler = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (!username || username.length > 20) {
      return res.status(422).json({ errorMessage: "Invalid username!" });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(422).json({ errorMessage: "Invalid email!" });
    }

    if (!password || password.length < 6 || password.length > 20) {
      return res.status(422).json({ errorMessage: "Invalid password" });
    }

    const client = await connectToDatabase();

    const hashedPassword = await hashPassword(password);

    const db = client.db();

    const existingUser = await db.collection("users").findOne({ username });

    if (existingUser) {
      client.close();
      return res
        .status(500)
        .json({ errorMessage: "Username has already been taken!" }); // TODO: find status code
    }

    await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
    });

    client.close();
    res.status(201).json({ successMessage: "User successfully created!" });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export default handler;
