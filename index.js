const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6htyl8q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const assignmentCollection = client.db("onlineStudy").collection("assignmentDb");
        const submittedAssignmentCollection = client.db("onlineStudy").collection("submittedAssignmentDb");


        app.get("/getAssignment", async (req, res) => {
            const result = await assignmentCollection.find().toArray();
            res.send(result);
        });
        app.get("/getAssignment/:id", async (req, res) => {
            const id = req.params.id;
            const result = await assignmentCollection.find({ _id: new ObjectId(id) }).toArray();
            res.send(result);
        });
        app.post("/submitAssignment", async (req, res) => {
            const assignment = req.body;
            const result = await submittedAssignmentCollection.insertOne(assignment);
            res.send(result);
        });

        app.get("/getSubmittedAssignments", async (req, res) => {
            const result = await submittedAssignmentCollection.find().toArray();
            res.send(result);
        });

        app.post("/createAssignment", async (req, res) => {
            const assignment = req.body;
            const result = await assignmentCollection.insertOne(assignment);
            res.send(result);
        });

        app.put("/updateAssignment/:id", async (req, res) => {
            const id = req.params.id;
            const updatedAssignment = req.body;
            const result = await assignmentCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedAssignment },
                { upsert: true }
            );
            res.send({ result });
        });
        
        app.delete("/deleteAssignment/:id", async (req, res) => {
            const id = req.params.id;
            const result = await assignmentCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('yoyo is running')
})

app.listen(port, () => {
    console.log(`Building management  is sitting on port ${port}`);
})