const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a0pfpbg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // server code start
    const usersCollection = client.db("univistaDB").collection("users");
    const collegesCollection = client.db("univistaDB").collection("colleges");
    const bookingsCollection = client.db("univistaDB").collection("bookings");

    app.get("/colleges", async (req, res) => {
      const result = await collegesCollection.find().toArray();
      res.send(result);
    });
    app.get("/colleges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegesCollection.findOne(query);
      res.send(result);
    });

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: user,
      };

      const result = await usersCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/admission/:email", async (req, res) => {
      const email = req.params.email;
      const admission = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: admission,
      };

      const result = await bookingsCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.get("/admission/:email", async (req, res) => {
      const userEmail = req.params.email;
      const query = { email: userEmail };

      const result = await bookingsCollection.find(query);
      res.send(result);
    });

    // server code end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Univista Server is running on port: ${port}`);
});

app.listen(port, () => {
  console.log(`AirCNC is running on port http://localhost:${port}`);
});
