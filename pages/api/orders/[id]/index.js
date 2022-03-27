import { connectToDatabase } from "../../../../utils/helper/db";
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
        .collection("orders")
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
}

export default handler;
