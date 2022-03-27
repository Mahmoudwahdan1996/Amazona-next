import { connectToDatabase } from "../../../utils/helper/db";

async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();
    try {
      const result = await db.collection("products").distinct("category");
      client.close();
      res.status(201).json({ message: "Data inserted", data: result });
    } catch (error) {
      client.close();
      res.status(422).json({ message: "Failed to post Data" });
    }
  }
}

export default handler;
