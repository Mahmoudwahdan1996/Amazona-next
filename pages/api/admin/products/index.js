import { connectToDatabase } from "../../../../utils/helper/db";
async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();

    const products = await db.collection("products").find().toArray();

    client.close();
    res.status(201).json({
      message: "Successful to get products !",
      data: products,
    });
  }

  if (req.method === "POST") {
    const client = await connectToDatabase();
    const db = client.db();

    const product = await db
      .collection("products")
      .insertOne(req.body.productData);
    client.close();
    res.status(201).json({
      message: "Successful to create products !",
      data: product,
    });
  }
}

export default handler;
