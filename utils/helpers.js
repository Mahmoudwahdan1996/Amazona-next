import { connectToDatabase } from "./helper/db";

async function getProducts() {
  const client = await connectToDatabase();
  const db = client.db();

  const result = await db.collection("products");
  const data = await result.find().toArray();

  const products = data.map((item) => {
    return {
      name: item.name,
      slug: item.slug,
      category: item.category,
      image: item.image,
      price: item.price,
      brand: item.brand,
      rating: item.rating ? item.rating : 0,
      numReviews: item.numReviews ? item.numReviews : 0,
      countInStock: item.countInStock,
      description: item.description,
      id: item._id.toString(),
    };
  });

  client.close();
  return products;
}

export default getProducts;

export async function getProduct(slug) {
  const client = await connectToDatabase();
  const db = client.db();

  const result = await db.collection("products");
  const data = await result.findOne({ slug });

  const product = {
    name: data.name,
    slug: data.slug,
    category: data.category,
    image: data.image,
    price: data.price,
    brand: data.brand,
    rating: data.rating ? data.rating : 0,
    numReviews: data.numReviews ? data.numReviews : 0,
    countInStock: data.countInStock,
    description: data.description,
    id: data._id.toString(),
  };

  client.close();
  return product;
}
