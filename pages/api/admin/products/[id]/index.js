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
        .collection("products")
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
    const productData = req.body.productData;
    console.log();
    try {
      const product = await db
        .collection("products")
        .findOne({ _id: ObjectId(id) });

      if (product) {
        product.name = productData.name;
        product.slug = productData.slug;
        product.price = productData.price;
        product.image = productData.image;
        product.category = productData.category;
        product.brand = productData.brand;
        product.numReviews = productData.numReviews;
        product.countInStock = productData.countInStock;
        product.description = productData.description;

        await db
          .collection("products")
          .updateOne({ _id: ObjectId(id) }, { $set: product });

        client.close();
        res.status(201).json({
          message: "Product updated successfully",
        });
      }
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Failed to update Product !" });
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
        .collection("products")
        .deleteOne({ _id: ObjectId(id) });
      client.close();
      res.status(201).json({
        message: "Product Deleted",
        data: result,
      });
    } catch (error) {
      client.close();
      res.status(500).json("Product Not Found");
    }
  }
}
export default handler;
