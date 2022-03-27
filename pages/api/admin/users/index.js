import { connectToDatabase } from "../../../../utils/helper/db";
async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();

    const products = await db.collection("clients").find().toArray();

    client.close();
    res.status(201).json({
      message: "Successful to get products !",
      data: products,
    });
  }
}

export default handler;
