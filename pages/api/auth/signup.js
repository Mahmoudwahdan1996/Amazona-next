import { hashPassword } from "../../../utils/helper/auth";
import { connectToDatabase } from "../../../utils/helper/db";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const { userName, email, password, confirmpassword, isAdmin } = data;

    if (
      !userName ||
      userName.trim().length < 7 ||
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length === 0 ||
      confirmpassword !== password
    ) {
      res.status(422).json({
        message: "Invlied Input - ",
      });
      return;
    }

    const client = await connectToDatabase();

    const db = client.db();

    const existingUser = await db
      .collection("clients")
      .findOne({ email: email });

    if (existingUser) {
      res.status(422).json({ message: "User exists already !" });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection("clients").insertOne({
      email: email,
      password: hashedPassword,
      userName: userName,
      isAdmin,
    });

    res.status(201).json({ message: "Create auser !", result: result });
    client.close();
  }
}

export default handler;
