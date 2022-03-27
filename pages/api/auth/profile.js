import { connectToDatabase } from "../../../utils/helper/db";
import { verifyPassword, hashPassword } from "../../../utils/helper/auth";
import { getSession } from "next-auth/react";

async function handler(req, res) {
  if (req.method === "PATCH") {
    const session = await getSession({ req: req });

    if (!session) {
      res.status(401).json({ message: "Not Authenticated" });
      return;
    }

    const userEmail = req.body.email;
    const oldPassword = req.body.password;
    const newPassword = req.body.newpassword;
    const userName = req.body.userName;

    console.log(req.body);

    const client = await connectToDatabase();
    const usersCollection = client.db().collection("clients");

    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      res.status(404).json({ message: "User Not found !" });
      client.close();
      return;
    }

    const currentPassword = user.password;

    const passwordsAreEquale = await verifyPassword(
      oldPassword,
      currentPassword
    );

    if (!passwordsAreEquale) {
      res.status(403).json({ message: "Invalid Password !" });
      client.close();
      return;
    }

    const hashedPasswod = await hashPassword(newPassword);

    const result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: { password: hashedPasswod, userName: userName } }
    );
    client.close();
    res.status(201).json({ message: "Password Updated ", result });
    return;
  }
}

export default handler;
