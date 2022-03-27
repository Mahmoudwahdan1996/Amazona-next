import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://MH_db1996:mh221096@cluster0.mjypt.mongodb.net/auth-demo?retryWrites=true&w=majority"
  );

  return client;
}
