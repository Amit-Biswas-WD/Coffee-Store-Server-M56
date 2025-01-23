const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yit3t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const usersCollection = client.db("coffeeDB").collection("users");

    // Create data
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log("Adding New Coffee", newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // see data from client side
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // (single id khujar process)
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // edit (Single card/id details)
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffeeUpdate = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = {
        $set: {
          name: coffeeUpdate.name,
          chef: coffeeUpdate.chef,
          supplier: coffeeUpdate.supplier,
          taste: coffeeUpdate.taste,
          category: coffeeUpdate.category,
          details: coffeeUpdate.details,
          photo: coffeeUpdate.photo,
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // Delete Card/id
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // user related api (Sign-In)
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("New user", newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // user see to server side
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result); 
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee server is Running");
});

app.listen(port, () => {
  console.log(`Coffee server is Running in port: ${port}`);
});
