require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

const { MongoClient, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster2.siyj0jl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("mealDb");
    const mealCollection = db.collection("mealDbCollection");

    // Ensure indexes are created
    await mealCollection.createIndex(
      { title: 1, category: 1 },
      { name: "titleCategory" }
    );

    // Define your API endpoints
    app.get("/allMeals", async (req, res) => {
      const jobs = await mealCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(jobs);
    });

    app.get("/singleMeal/:id", async (req, res) => {
      const job = await mealCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(job);
    });

    app.get("/getmealByText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await mealCollection
        .find({
          $or: [
            { title: { $regex: text, $options: "i" } },
            { category: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    // Close MongoDB client on application exit
    process.on("SIGINT", () => {
      client.close().then(() => {
        console.log("MongoDB connection closed");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
