import { connectToDatabase } from "../../../../../utils/helper/db";
import { ObjectId } from "mongodb";

async function handler(req, res) {
  if (req.method === "GET") {
    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({
        message: "Failed to connect to server !",
      });
    }
    const db = client.db();

    const id = req.query.id;
    try {
      const result = await db
        .collection("clients")
        .findOne({ _id: ObjectId(id) });
      client.close();
      res.status(201).json({
        message: "Successful stored message !",
        data: result,
      });
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Failed to get order on server !" });
    }
  }

  if (req.method === "PUT") {
    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({
        message: "Failed to connect to server !",
      });
    }
    const db = client.db();

    const id = req.query.id;
    const userData = req.body.userData;
    console.log(userData);
    try {
      const user = await db
        .collection("clients")
        .findOne({ _id: ObjectId(id) });

      if (user) {
        user.userName = userData.userName;
        user.isAdmin = userData.isAdmin;

        await db
          .collection("clients")
          .updateOne({ _id: ObjectId(id) }, { $set: user });

        client.close();
        res.status(201).json({
          message: "User updated successfully",
        });
      }
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Failed Update user !" });
    }
  }

  if (req.method === "DELETE") {
    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({
        message: "Failed to connect to server !",
      });
    }
    const db = client.db();

    const id = req.query.id;
    try {
      const result = await db
        .collection("clients")
        .deleteOne({ _id: ObjectId(id) });
      client.close();
      res.status(201).json({
        message: "User deleted successfully",
        data: result,
      });
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Failed to delete user  !" });
    }
  }
}
export default handler;
