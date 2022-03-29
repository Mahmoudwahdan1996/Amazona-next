import { connectToDatabase } from "../../../../utils/helper/db";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();

    const db = client.db();

    const product = await db
      .collection("products")
      .findOne({ _id: ObjectId(req.query.id) });
    client.close();

    if (product) {
      res.send({ reviews: product.reviews });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  }

  if (req.method === "POST") {
    const session = await getSession({ req });
    const client = await connectToDatabase();

    const db = client.db();

    const product = await db
      .collection("products")
      .findOne({ _id: ObjectId(req.query.id) });
    const jsBody = JSON.parse(req.body);
    if (product) {
      const existReview = product.reviews.find(
        (x) => x.user == session.user.id
      );
      if (existReview) {
        await db.collection("products").updateOne(
          { _id: ObjectId(req.query.id), "reviews.user": existReview.user },
          {
            $set: {
              "reviews.$.comment": jsBody.comment,
              "reviews.$.rating": Number(jsBody.rating),
              "reviews.$.createdAt": new Date(),
            },
          }
        );

        const updatedProduct = await db
          .collection("products")
          .findOne({ _id: ObjectId(req.query.id) });
        const numReviews = updatedProduct.reviews.length;
        const rating =
          updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
          updatedProduct.reviews.length;

        await db.collection("products").updateOne(
          { _id: ObjectId(req.query.id) },
          {
            $set: {
              numReviews: numReviews,
              rating: Number(rating),
            },
          }
        );
        client.close();

        return res.send({ message: "Review updated" });
      } else {
        const review = {
          user: ObjectId(session.user.id),
          name: session.user.name,
          rating: Number(jsBody.rating),
          comment: jsBody.comment,
          createdAt: new Date(),
        };

        await db.collection("products").updateOne(
          { _id: ObjectId(req.query.id) },
          {
            $push: { reviews: review },
          }
        );

        const productUpdatedSecond = await db
          .collection("products")
          .findOne({ _id: ObjectId(req.query.id) });

        const numReviews = productUpdatedSecond.reviews.length;
        const rating =
          productUpdatedSecond.reviews.reduce((a, c) => c.rating + a, 0) /
          productUpdatedSecond.reviews.length;
        await db.collection("products").updateOne(
          { _id: ObjectId(req.query.id) },
          {
            $set: {
              numReviews: numReviews,
              rating: Number(rating),
            },
          }
        );

        client.close();

        res.status(201).send({
          message: "Review submitted",
        });
      }
    }
  }
}

export default handler;
